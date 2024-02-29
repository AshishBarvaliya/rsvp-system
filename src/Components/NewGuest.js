import React from "react";
import PropTypes from "prop-types";
import { Form } from "carbon-components-react";
import { Search } from "carbon-components-react";
import { Button } from "carbon-components-react";
import "./NewGuest.css";

const NewGuest = (props) => (
  <div className="new-guest">
    <Form className="new-guest__form" onSubmit={(e) => props.handleAddGuest(e)}>
      <label style={{ fontWeight: "bold", fontSize: "14px"}}>Add Guests</label>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px"}}>
          <Search
            id="new-guest-name"
            labelText="Search"
            onChange={props.handleNewGuestName}
            value={props.name}
            placeholder="Enter guest name"
            className="new-guest__name"
            style={{  width: "97%", display:"flex"}}
            autoComplete="off"
          />
          <Button type="submit" className="new-guest__submit">
            Add Guest
          </Button>
      </div>
    </Form>
  </div>
);

NewGuest.propTypes = {
  name: PropTypes.string.isRequired,
  handleNewGuestName: PropTypes.func.isRequired,
  handleAddGuest: PropTypes.func.isRequired,
};

export default NewGuest;
