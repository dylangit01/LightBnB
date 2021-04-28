-- INSERT INTO users (name, email, password)
-- VALUES ('Dylan', 'dylan@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
--  ('Sienna', 'sienna@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
--  ('Daxton', 'daxton@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- INSERT INTO properties (owner_id,title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms, country,street, city, province, post_code)
-- VALUES (1,'Oceanadri','description', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlTC_Ht4tI7JjEwiY9jDZ8TDzRVqlyKQPA7g&usqp=CAU','https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', 180, 4, 4, 6, 'Canada', 'Oceaniar', 'King', 'ON','L4Z 1Y6');

-- INSERT INTO properties (owner_id,title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,parking_spaces,number_of_bathrooms,number_of_bedrooms, country,street, city, province, post_code)
-- VALUES (2,'Skycastle','description', 'https://images.unsplash.com/photo-1591308081120-4c740df7b359?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80','https://images.unsplash.com/photo-1605834970749-4b6c5484f3c7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80', 240, 1, 3, 4, 'Japan', 'Okasha', 'Tokyo', 'Nido','JAP88'),
-- (3,'Skycastle','description', 'https://images.unsplash.com/photo-1608029372252-d02e8d1d45f1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1436&q=80','https://images.unsplash.com/photo-1556383887-8b037df1ab1e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 150, 2, 3, 4, 'China', 'Jiangnan Rd', 'Chengdu', 'Chongqin','550002');

-- INSERT INTO reservations (guest_id, property_id, start_date, end_date)
-- VALUES (1, 1, '2018-09-11', '2018-09-26'),
-- (2, 2, '2019-01-04', '2019-02-01'),
-- (3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 3, 3, 'messages'),
(1, 3, 2, 4, 'messages'),
(3, 2, 1, 5, 'messages');





