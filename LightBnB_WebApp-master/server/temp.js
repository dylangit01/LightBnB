const conditionsOption1 = [city, owner_id, minimum_price_per_night, maximum_price_per_night, minimum_rating];
if (conditionsOption1.includes(false)) {
  console.log('111111111111111111');
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
  console.log('2222222222222222');
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
  console.log('3333333333333333');
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
  console.log('444444444444444444');
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
  console.log('5555555555555555');
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
  console.log('6666666666666666');
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
