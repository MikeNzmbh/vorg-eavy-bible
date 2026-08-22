-- Optional compatible source; not executed by the v1 trainer.
-- Official dataset:
-- bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*
-- Date range: 2020-11-01 through 2021-01-31.
-- Google warns that obfuscation can limit internal consistency.

CREATE TEMP FUNCTION EventParamInt(event_params ANY TYPE, parameter_name STRING)
AS ((
  SELECT ANY_VALUE(value.int_value)
  FROM UNNEST(event_params)
  WHERE key = parameter_name
));

WITH event_rows AS (
  SELECT
    CONCAT(
      user_pseudo_id,
      '-',
      CAST(EventParamInt(event_params, 'ga_session_id') AS STRING)
    ) AS session_id,
    user_pseudo_id,
    event_timestamp,
    event_name,
    items
  FROM `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
    AND user_pseudo_id IS NOT NULL
    AND EventParamInt(event_params, 'ga_session_id') IS NOT NULL
),
session_flags AS (
  SELECT
    session_id,
    MAX(IF(event_name = 'view_item', 1, 0)) AS viewed_product,
    MAX(IF(event_name = 'add_to_cart', 1, 0)) AS added_to_cart,
    MAX(IF(event_name = 'begin_checkout', 1, 0)) AS began_checkout,
    MAX(IF(event_name = 'purchase', 1, 0)) AS purchased
  FROM event_rows
  GROUP BY session_id
),
purchase_units AS (
  SELECT
    COUNT(DISTINCT CONCAT(user_pseudo_id, '-', CAST(event_timestamp AS STRING))) AS purchase_events,
    SUM((
      SELECT SUM(COALESCE(item.quantity, 1))
      FROM UNNEST(items) AS item
    )) AS purchased_units
  FROM event_rows
  WHERE event_name = 'purchase'
)
SELECT
  COUNT(*) AS sessions,
  COUNTIF(viewed_product = 1) AS product_view_sessions,
  COUNTIF(added_to_cart = 1) AS cart_sessions,
  COUNTIF(began_checkout = 1) AS checkout_sessions,
  COUNTIF(purchased = 1) AS purchase_sessions,
  ANY_VALUE(purchase_units.purchase_events) AS purchase_events,
  ANY_VALUE(purchase_units.purchased_units) AS purchased_units
FROM session_flags
CROSS JOIN purchase_units;
