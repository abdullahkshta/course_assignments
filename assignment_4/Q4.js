//  Select customer_id  , count(visit_id)AS count_no_trans from visits where visit_id NOT IN (select visit_id FROM Transactions) GROUP BY customer_id ;
