import React, { Component } from "react";
import { Tile } from "carbon-components-react";
import GuestList from "./Components/GuestList";
import NewGuest from "./Components/NewGuest";
import "./App.css";
import { Button } from "carbon-components-react";
import { TextInput } from "carbon-components-react";

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  width: "300px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
  backgroundColor: "white",
};

const titleStyle = {
  color: "#333",
  fontFamily: "Arial, sans-serif",
  fontSize: "20px",
  marginBottom: "10px",
  fontWeight: "bold",
};

const textStyle = {
  color: "#666",
  fontFamily: "Arial, sans-serif",
  fontSize: "14px",
  marginBottom: "5px",
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      newGuest: "",
      editGuestData: {},
      guests: [],
      selectedEvent:
        null |
        {
          id: "",
          name: "",
          guests: [],
          date: "",
        },
      data: {
        name: "",
        guests: [],
        date: "",
      },
      events: [],
    };
  }

  getGuestDefaultData = () => {
    return {
      id: "",
      name: "",
      isConfirmed: false,
      guests: 0,
      address: {
        l1: "",
        l2: "",
        city: "",
        state: "",
        zipcode: "",
      },
    };
  };

  handleNewGuestName = (name) =>
    this.setState({
      newGuest: name,
    });

  handleGuestName = (name, id) => this.updateGuestData("name", name, id);

  handleGuestRsvp = (rsvp, id) => this.updateGuestData("isConfirmed", rsvp, id);

  handleGuestGuests = (guests, id) =>
    this.updateGuestData("guests", guests, id);

  handleAddressL1 = (l1, id) => this.updateGuestAddress("l1", l1, id);

  handleAddressL2 = (l2, id) => this.updateGuestAddress("l2", l2, id);

  handleAddressCity = (city, id) => this.updateGuestAddress("city", city, id);

  handleAddressState = (state, id) =>
    this.updateGuestAddress("state", state, id);

  handleAddressZipcode = (zipcode, id) =>
    this.updateGuestAddress("zipcode", zipcode, id);

  updateGuestAddress = (attribute, value, id) => {
    let guest = this.state.guests.filter((guest) => guest.id === id);
    let address = {};

    // Get current address.
    if (guest.length > 0) {
      address = {
        ...guest[0].address,
      };
    }

    // Combine old address with data in editGuestData.
    if (
      this.state.editGuestData[id] &&
      "address" in this.state.editGuestData[id]
    ) {
      address = {
        ...address,
        ...this.state.editGuestData[id].address,
      };
    }

    // Update address field.
    address = {
      ...address,
      [attribute]: value,
    };

    this.updateGuestData("address", address, id);
  };

  updateGuestData = (attribute, value, id) => {
    let guestData = {
      ...this.state.editGuestData[id],
      [attribute]: value,
    };
    this.setState({
      editGuestData: {
        ...this.state.editGuestData,
        [id]: guestData,
      },
    });
  };

  handleAddGuest = (e) => {
    e.preventDefault();
    let newGuest = this.getGuestDefaultData();
    if (this.state.newGuest === "") {
      return;
    }
    newGuest.id = Math.random().toString(36).substr(2, 9);
    newGuest.name = this.state.newGuest;

    this.setState({
      guests: [newGuest, ...this.state.guests],
      newGuest: "",
    });
  };

  handleUpdateGuest = (e, id) => {
    this.setState({
      guests: this.state.guests.map((guest, index) => {
        if (guest.id === id) {
          return {
            ...guest,
            ...this.state.editGuestData[id],
          };
        }
        return guest;
      }),
      editGuestData: {
        ...this.state.editGuestData,
        [id]: {},
      },
    });

    return true;
  };

  handleRemoveGuest = (e, id) => {
    const { [id]: value, ...newGuests } = this.state.editGuestData;

    this.setState({
      guests: this.state.guests.filter((guest) => guest.id !== id),
      editGuestData: newGuests,
    });

    return true;
  };

  getInvitedGuestCount = () => {
    if (!this.state.guests) {
      return 0;
    }

    return this.state.guests.reduce(
      (accumulator, guest) => accumulator + 1 + guest.guests,
      0
    );
  };

  getConfirmedGuestCount = () => {
    if (!this.state.guests) {
      return 0;
    }

    return this.state.guests.reduce(
      (accumulator, guest) =>
        accumulator + (guest.isConfirmed ? 1 + guest.guests : 0),
      0
    );
  };

  render() {
    const { selectedEvent, events, data } = this.state;
    return (
      <div className="app">
        <img src={"./logo.png"} alt="logo" style={{ width: 200, margin: 10 }} />
        {selectedEvent ? (
          <React.Fragment>
            <div className="app__meta">
              <Tile
                style={{
                  gap: "30px",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <h1>{selectedEvent.id ? "Edit Event" : "New Event"}</h1>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      onClick={() =>
                        this.setState({
                          selectedEvent: null,
                          data: {
                            name: "",
                            guests: [],
                            date: "",
                          },
                        })
                      }
                      style={{ marginLeft: "auto", backgroundColor: "red" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (selectedEvent.id) {
                          const newEvents = events.map((event) => {
                            if (event.id === selectedEvent.id) {
                              return {
                                ...event,
                                ...data,
                                guests: this.state.guests,
                              };
                            }
                            return event;
                          });
                          this.setState({
                            events: newEvents,
                            selectedEvent: null,
                            data: {
                              name: "",
                              guests: [],
                              date: "",
                            },
                          });
                        } else {
                          this.setState({
                            events: [
                              ...events,
                              {
                                ...data,
                                id: Math.random().toString(36).substr(2, 9),
                                guests: this.state.guests,
                              },
                            ],
                            selectedEvent: null,
                            data: {
                              name: "",
                              guests: [],
                              date: "",
                            },
                          });
                        }
                      }}
                      style={{ marginLeft: "auto", backgroundColor: "green" }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <TextInput
                  labelText="Event"
                  value={data.name}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        name: e.target.value,
                      },
                    });
                  }}
                />
                <TextInput
                  labelText="Date"
                  type="datetime-local"
                  value={data.date}
                  onChange={(e) => {
                    this.setState({
                      data: {
                        ...this.state.data,
                        date: e.target.value,
                      },
                    });
                  }}
                />
                <NewGuest
                  name={this.state.newGuest}
                  handleNewGuestName={(e) =>
                    this.handleNewGuestName(e.target.value)
                  }
                  handleAddGuest={(e) => this.handleAddGuest(e)}
                />
                <div className="app__stats">
                  <div className="bx--grid">
                    <div className="bx--row">
                      <div className="bx--col-xs-6">
                        <div className="app__invited">
                          <strong>Invited Guests:</strong>{" "}
                          {this.getInvitedGuestCount()}
                        </div>
                      </div>
                      <div className="bx--col-xs-6 ">
                        <div className="app__confirmed">
                          <strong>Confirmed Guests:</strong>{" "}
                          {this.getConfirmedGuestCount()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="app__guest-list">
                  <GuestList
                    guests={this.state.guests}
                    newGuest={this.state.newGuest}
                    handleGuestName={this.handleGuestName}
                    handleGuestRsvp={this.handleGuestRsvp}
                    handleGuestGuests={this.handleGuestGuests}
                    handleAddressL1={this.handleAddressL1}
                    handleAddressL2={this.handleAddressL2}
                    handleAddressCity={this.handleAddressCity}
                    handleAddressState={this.handleAddressState}
                    handleAddressZipcode={this.handleAddressZipcode}
                    handleUpdateGuest={this.handleUpdateGuest}
                    handleRemoveGuest={this.handleRemoveGuest}
                  />
                </div>
              </Tile>
            </div>
          </React.Fragment>
        ) : (
          <div style={{ paddingTop: "10px" }}>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <h1 className="app__title" style={{ marginLeft: "140px" }}>
                All Events
              </h1>
              <Button
                onClick={() =>
                  this.setState({
                    selectedEvent: {
                      id: "",
                      name: "",
                      guests: [],
                      date: "",
                    },
                    data: {
                      name: "",
                      guests: [],
                      date: "",
                    },
                    newGuest: "",
                    guests: [],
                  })
                }
                style={{ marginLeft: "100px" }}
              >
                Add Event
              </Button>
            </div>
            {events ? (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <div style={{ display: "flex", width: "800px" }}>
                  {events.map((event) => (
                    <div
                      style={cardStyle}
                      key={event.id}
                      onClick={() =>
                        this.setState({
                          selectedEvent: event,
                          data: event,
                          guests: event.guests,
                        })
                      }
                    >
                      <h2 style={titleStyle}>{event.name}</h2>
                      <p style={textStyle}>
                        Date: <strong>{event.date}</strong>
                      </p>
                      <p style={textStyle}>
                        Invited Guests:{" "}
                        <strong>
                          {event.guests.reduce(
                            (accumulator, guest) =>
                              accumulator + 1 + guest.guests,
                            0
                          )}
                        </strong>
                      </p>
                      <p style={textStyle}>
                        Confirmed Guests:{" "}
                        <strong>
                          {event.guests.reduce(
                            (accumulator, guest) =>
                              accumulator +
                              (guest.isConfirmed ? 1 + guest.guests : 0),
                            0
                          )}
                        </strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              "No events found"
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
