const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);

  return pool
    .query(`SELECT * FROM users WHERE email ILIKE $1`, [email])
    .then((res) => (res.rows.length === 0 ? null : res.rows[0]))
    .catch((err) => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  // return Promise.resolve(users[id]);
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((res) => (res.rows.length === 0 ? null : res.rows[0]))
    .catch((err) => console.log(err.message));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  const { name, email, password } = user;
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [
      `${name}`,
      `${email}`,
      `${password}`,
    ])
    .then((res) => res.rows[0].id)
    .catch((err) => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  // return getAllProperties(null, 2);
  return pool
    .query(
      `
    SELECT properties.*,reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    AND reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
    `,
      [guest_id, limit]
    )
    .then((res) => res.rows)
    .catch((err) => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//     console.log(limitedProperties[i]);
//   }
//   return Promise.resolve(limitedProperties);
// }

const getAllProperties = (options, limit = 10) => {
  const { city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating } = options;
  const queryParams = [];
  console.log(options);
  // Basic query
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

  if (owner_id) {
    queryParams.push(owner_id);
    queryString += `WHERE owner_id = $${queryParams.length}`;

    // Passed limit
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    console.log(queryString, queryParams);

    return pool
      .query(queryString, queryParams)
      .then((res) => res.rows)
      .catch((err) => console.log(err.message));
  } else {
    if (minimum_rating) {
      if (city) {
        queryParams.push(`%${city}%`);
        queryString += `WHERE city LIKE $${queryParams.length}`;

        if (minimum_price_per_night && maximum_price_per_night) {
          queryParams.push(minimum_price_per_night, maximum_price_per_night);
          queryString += ` AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        } else if (minimum_price_per_night) {
          queryParams.push(minimum_price_per_night);
          queryString += ` AND cost_per_night >= $${queryParams.length}`;
        } else if (maximum_price_per_night) {
          queryParams.push(maximum_price_per_night);
          queryString += ` AND cost_per_night <= $${queryParams.length}`;
        }
      } else {
        if (minimum_price_per_night && maximum_price_per_night) {
          queryParams.push(minimum_price_per_night, maximum_price_per_night);
          queryString += `WHERE cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        } else if (minimum_price_per_night) {
          queryParams.push(minimum_price_per_night);
          queryString += `WHERE cost_per_night >= $${queryParams.length}`;
        } else if (maximum_price_per_night) {
          queryParams.push(maximum_price_per_night);
          queryString += `WHERE cost_per_night <= $${queryParams.length}`;
        }
      }
      queryParams.push(minimum_rating);
      queryString += `GROUP BY properties.id HAVING avg(property_reviews.rating) >= $${queryParams.length}`;

      // 4
      queryParams.push(limit);
      queryString += `
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;

      // 5
      console.log(queryString, queryParams);

      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    } else {
      if (city) {
        queryParams.push(`%${city}%`);
        queryString += `WHERE city LIKE $${queryParams.length}`;

        if (minimum_price_per_night && maximum_price_per_night) {
          queryParams.push(minimum_price_per_night, maximum_price_per_night);
          queryString += `AND cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        }
        if (minimum_price_per_night) {
          queryParams.push(minimum_price_per_night);
          queryString += `AND cost_per_night >= $${queryParams.length}`;
        }
        if (maximum_price_per_night) {
          queryParams.push(maximum_price_per_night);
          queryString += `AND cost_per_night <= $${queryParams.length}`;
        }
      } else {
        if (minimum_price_per_night && maximum_price_per_night) {
          queryParams.push(minimum_price_per_night, maximum_price_per_night);
          queryString += `WHERE cost_per_night BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
        }
        if (minimum_price_per_night) {
          queryParams.push(minimum_price_per_night);
          queryString += `WHERE cost_per_night >= $${queryParams.length}`;
        }
        if (maximum_price_per_night) {
          queryParams.push(maximum_price_per_night);
          queryString += `WHERE cost_per_night <= $${queryParams.length}`;
        }
      }
      // 4
      queryParams.push(limit);
      queryString += `
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $${queryParams.length};
      `;

      // 5
      console.log(queryString, queryParams);

      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }
  }
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {

  const {
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms,
  } = property;

  return pool
    .query(
      `
    INSERT INTO properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
    `,
      [
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        cost_per_night,
        street,
        city,
        province,
        post_code,
        country,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms,
      ]
    )
    .then((res) => res.rows[0])
    .catch((err) => console.log(err.message));
};
exports.addProperty = addProperty;
