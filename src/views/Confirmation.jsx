import "./Confirmation.scss";
import { useLocation } from "react-router-dom";
import Top from "../components/Top/Top";
import Navigation from "../components/Navigation/Navigation";
import Input from "../components/Input/Input";

function Confirmation() {
  const { state } = useLocation();

  let confirmation = state?.confirmationDetails;

  try {
    if (!confirmation) {
      const storedConfirmation = sessionStorage.getItem("confirmation");
      if (storedConfirmation) {
        confirmation = JSON.parse(storedConfirmation);
      }
    }
  } catch (error) {

    confirmation = null;
  }

  return (
    <section className="confirmation">
      <Navigation />
      <Top title="See you soon!" />
      {confirmation ? (
        <form className="confirmation__details">
          <Input
            label="When"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.when.replace("T", " ")}
            disabled="disabled"
          />
          <Input
            label="Who"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.people}
            disabled="disabled"
          />
          <Input
            label="Lanes"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.lanes}
            disabled="disabled"
          />
          <Input
            label="Booking number"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.id}
            disabled="disabled"
          />
          <article className="confirmation__price">
            <p>Total:</p>
            <p>{confirmation.price} sek</p>
          </article>
          <button className="button confirmation__button">
            Sweet, let's go!
          </button>
        </form>
      ) : (
        <h2 className="confirmation__no-booking">Inga bokning gjord!</h2>
      )}
    </section>
  );
}

export default Confirmation;
