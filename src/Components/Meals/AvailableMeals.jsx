import { useEffect, useState } from "react";
import useHttp from "../../Hooks/useHttp";
import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([])
  const { isLoading, error: httpError, sendRequest } = useHttp();

  useEffect(() => {
    let loadedMeals = [];
    const getMeals = (allMeals) => {
      for (const key in allMeals) {
        loadedMeals.push({
          id: key,
          name: allMeals[key].name,
          description: allMeals[key].description,
          price: allMeals[key].price,
        });
      }
    };
    setMeals(loadedMeals);

    sendRequest(
      {
        url: "https://reactmeals-f9f80-default-rtdb.firebaseio.com/meals.json",
      },
      getMeals
    );
  }, [sendRequest]);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  return (
    <section className={classes.meals}>
      <Card>
        {isLoading && <p>Loading ...</p>}
        {httpError && <p>{httpError}</p>}
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
