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
  let queryParams = [];
  console.log(options);
  // Basic query
  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
  if (owner_id) {
    console.log('user logged innnnnnnnnnnnn');
    const conditionsOption1 = [city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating];
    if (conditionsOption1.includes(false)) {
      queryParams = [`%${city}%`, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating, limit];
      queryString += `
      WHERE city ILIKE $1 AND owner_id = $2 AND cost_per_night BETWEEN $3 AND $4
      GROUP BY properties.id HAVING avg(property_reviews.rating) >= $5
      ORDER BY cost_per_night
      LIMIT $6;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption2 = [owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating];
    if (conditionsOption2.includes(false)) {
      queryParams = [owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating, limit];
      queryString += `
      WHERE owner_id = $1 AND cost_per_night BETWEEN $2 AND $3
      GROUP BY properties.id HAVING avg(property_reviews.rating) >= $4
      ORDER BY cost_per_night
      LIMIT $5;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption3 = [city, owner_id, minimum_price_per_night, maximum_price_per_night];
    if (conditionsOption3.includes(false)) {
      queryParams = [`%${city}%`, owner_id, minimum_price_per_night, maximum_price_per_night, limit];
      queryString += `
      WHERE city ILIKE $1 AND owner_id = $2 AND cost_per_night BETWEEN $3 AND $4
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $5;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption4 = [owner_id, minimum_price_per_night, maximum_price_per_night];
    if (conditionsOption4.includes(false)) {
      queryParams = [owner_id, minimum_price_per_night, maximum_price_per_night, limit];
      queryString += `
      WHERE owner_id = $1 AND cost_per_night BETWEEN $2 AND $3
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $4;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

      const conditionsOption5 = [minimum_price_per_night, maximum_price_per_night, minimum_rating];
      if (conditionsOption5.includes(false)) {
        queryParams = [owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating, limit];
        queryString += `
        WHERE owner_id = $1 AND cost_per_night BETWEEN $2 AND $3
        GROUP BY properties.id HAVING avg(property_reviews.rating) >= $4
        ORDER BY cost_per_night
        LIMIT $5;
        `;
        return pool
          .query(queryString, queryParams)
          .then((res) => res.rows)
          .catch((err) => console.log(err.message));
      }

    // If has min rating only
    if (minimum_rating) {
      queryParams = [owner_id, minimum_rating, limit];
      queryString += `
      WHERE owner_id = $1
      GROUP BY properties.id HAVING avg(property_reviews.rating) >= $2
      ORDER BY cost_per_night
      LIMIT $3
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    queryParams.push(owner_id);
    queryString += `WHERE owner_id = $${queryParams.length}`;

    // If has city only
    if (city) {
      console.log('cityyyyyyyyyyyy');
      queryParams.push(`%${city}%`);
      queryString += `AND city ILIKE $${queryParams.length}`;
    }

    // Passed limit
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    // 5
    console.log(queryString, queryParams);

    // 6
    return pool
      .query(queryString, queryParams)
      .then((res) => res.rows)
      .catch((err) => console.log(err.message));
    
  } else {

    console.log('user NOT logged innnnnnnnnnnnn');
    const conditionsOption6 = [city, minimum_price_per_night, maximum_price_per_night, minimum_rating];
    if (conditionsOption6.includes(false)) {
      queryParams = [`%${city}%`, minimum_price_per_night, maximum_price_per_night, minimum_rating, limit];
      queryString += `
      WHERE city ILIKE $1 AND cost_per_night BETWEEN $2 AND $3
      GROUP BY properties.id HAVING avg(property_reviews.rating) >= $4
      ORDER BY cost_per_night
      LIMIT $5;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption7 = [city, minimum_price_per_night, maximum_price_per_night];
    if (conditionsOption7.includes(false)) {
      queryParams = [`%${city}%`, minimum_price_per_night, maximum_price_per_night, limit];
      queryString += `
      WHERE city ILIKE $1 AND cost_per_night BETWEEN $2 AND $3
      GROUP BY properties.id
      ORDER BY cost_per_night
      LIMIT $4;
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption8 = [minimum_price_per_night, maximum_price_per_night, minimum_rating];
    if (conditionsOption8.includes(false)) {
      queryParams = [minimum_price_per_night, maximum_price_per_night, minimum_rating, limit];
      queryString += `
        WHERE cost_per_night BETWEEN $1 AND $2
        GROUP BY properties.id HAVING avg(property_reviews.rating) >= $3
        ORDER BY cost_per_night
        LIMIT $4;
        `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    const conditionsOption9 = [minimum_price_per_night, maximum_price_per_night];
    if (conditionsOption9.includes(false)) {
      queryParams = [minimum_price_per_night, maximum_price_per_night, limit];
      queryString += `
        WHERE cost_per_night BETWEEN $1 AND $2
        GROUP BY properties.id
        ORDER BY cost_per_night
        LIMIT $3;
        `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    if (minimum_rating && city) {
      queryParams = [`%${city}%`, minimum_rating, limit];
      queryString += `
          WHERE city ILIKE $1
          GROUP BY properties.id HAVING avg(property_reviews.rating) >= $2
          ORDER BY cost_per_night
          LIMIT $3
          `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    // If has min rating only
    if (minimum_rating) {
      queryParams = [minimum_rating, limit];
      queryString += `
      GROUP BY properties.id HAVING avg(property_reviews.rating) >= $1
      ORDER BY cost_per_night
      LIMIT $2
      `;
      return pool
        .query(queryString, queryParams)
        .then((res) => res.rows)
        .catch((err) => console.log(err.message));
    }

    // If has city only
    if (city) {
      queryParams.push(`%${city}%`);
      queryString += `WHERE city ILIKE $${queryParams.length}`;
    }

    // Passed limit
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

    // 5
    console.log(queryString, queryParams);

    // 6
    return pool
      .query(queryString, queryParams)
      .then((res) => res.rows)
      .catch((err) => console.log(err.message));
  }
  
  // return pool
  //   .query(`SELECT * FROM properties LIMIT $1`, [limit])
  //   .then((result) => result.rows)
  //   .catch((err) => console.log(err.message));
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
