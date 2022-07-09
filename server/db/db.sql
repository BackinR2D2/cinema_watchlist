CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    last_login VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE user_list (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    info JSON NOT NULL,
    type VARCHAR NOT NULL, -- type: movie || tv show
    status VARCHAR NOT NULL, -- status: watching || completed || on hold || dropped || plan to watch
    notebody VARCHAR, -- note body
    favorite VARCHAR NOT NULL DEFAULT 'no', -- favorite: 'no' || 'yes'
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);