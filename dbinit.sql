-- SEQUENCE: public.order_id_sequence

-- DROP SEQUENCE public.order_id_sequence;

CREATE SEQUENCE public.order_id_sequence
    INCREMENT 1
    START 3
    MINVALUE 0
    MAXVALUE 9999999999999
    CACHE 1;

ALTER SEQUENCE public.order_id_sequence
    OWNER TO postgres;

-- Table: public.orders

-- DROP TABLE public.orders;

CREATE TABLE public.orders
(
    user_id bigint NOT NULL,
    rest_id text COLLATE pg_catalog."default" NOT NULL,
    order_timestamp text COLLATE pg_catalog."default" NOT NULL,
    order_completion integer,
    order_amount money NOT NULL,
    id bigint NOT NULL DEFAULT nextval('order_id_sequence'::regclass),
    order_time integer,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.orders
    OWNER to postgres;
