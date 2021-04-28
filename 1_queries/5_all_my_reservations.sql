-- SELECT reservations.*, properties.*, avg(rating) average_rating
-- FROM reservations
-- JOIN properties ON property_id = properties.id
-- JOIN property_reviews ON reservation_id = reservations.id
-- WHERE reservations.guest_id = 1
-- GROUP BY reservations.id, properties.id HAVING end_date < now()::date
-- ORDER BY start_date
-- LIMIT 10;

-- SELECT properties.id,properties.title, properties.cost_per_night,start_date,reservations.id, avg(rating) average_rating
-- FROM reservations
-- JOIN properties ON property_id = properties.id
-- JOIN property_reviews ON reservation_id = reservations.id
-- WHERE reservations.guest_id = 1 AND end_date < now()::date
-- GROUP BY reservations.id, properties.id
-- ORDER BY start_date
-- LIMIT 10;


SELECT properties.*,reservations.*, avg(rating) as average_rating
FROM reservations
JOIN properties ON reservations.property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
AND reservations.end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY reservations.start_date
LIMIT 10;
