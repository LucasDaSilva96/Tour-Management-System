import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentSelectedBooking,
  toggleReservationModal,
} from "../redux/bookingSlice";
import ReservationModal from "./ReservationModal";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function Calendar() {
  const bookings = useQueryClient().getQueryData(["AllBookings"]); // Getting bookings data from React Query
  const dispatch = useDispatch(); // Dispatch function from Redux
  const navigate = useNavigate(); // Navigate function from React Router
  const calendarRef = useRef(null); // Ref for accessing FullCalendar instance

  // Function to navigate to the previous year in the calendar
  const goToPrevYear = () => {
    calendarRef.current.getApi().prevYear();
  };

  // Function to navigate to the next year in the calendar
  const goToNextYear = () => {
    calendarRef.current.getApi().nextYear();
  };

  // Function to handle click on a calendar event
  const handleEventClick = (clickInfo) => {
    const selectedBooking = bookings.find(
      (el) => el._id === clickInfo.event.extendedProps._id
    );
    dispatch(toggleReservationModal()); // Dispatching action to toggle reservation modal
    dispatch(setCurrentSelectedBooking(selectedBooking)); // Dispatching action to set current selected booking
  };

  // Function to handle click on adding a new event in the calendar
  const handleAddNewEventClick = (clickInfo) => {
    const dateClicked = new Date(clickInfo.dateStr).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    const isBefore = dayjs(dateClicked).isBefore(dayjs(today));

    if (!isBefore || dateClicked.toLocaleString() === today.toLocaleString()) {
      // Navigate to new reservation page
      return navigate(`newReservation/${clickInfo.dateStr}`);
    } else {
      return toast.error("A new booking can't take place in the past."); // Show error toast
    }
  };

  // Function to handle view change in the calendar
  const handleView = (view) => {
    localStorage.setItem("view", view.view.type); // Storing current view type in localStorage
  };

  // Function to render custom event content
  const renderEventContent = (eventInfo) => {
    return (
      <article className="flex items-center justify-around flex-wrap">
        <span>{eventInfo.timeText}</span>
        <span>{eventInfo.event.title}</span>
        {eventInfo.event._def.extendedProps.guide && (
          <PersonIcon fontSize="small" />
        )}
        {eventInfo.event._def.extendedProps.snacks && (
          <RestaurantMenuIcon fontSize="small" />
        )}
      </article>
    );
  };

  return (
    <div>
      {/* FullCalendar component */}
      <FullCalendar
        themeSystem="bootstrap5"
        dateClick={handleAddNewEventClick} // Event handler for date click
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]} // Plugins used in FullCalendar
        initialView={localStorage.getItem("view")} // Initial view of the calendar
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to false for 24-hour format
        }}
        height={"80dvh"} // Height of the calendar
        events={bookings} // Events to be displayed in the calendar
        eventDisplay="block"
        // Buttons for switching views
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "today,prev,prevYear,next,nextYear,custom2",
        }}
        // Buttons for navigation
        customButtons={{
          prevYear: {
            text: "Prev Year",
            click: goToPrevYear, // Event handler for clicking "Prev Year" button
          },
          nextYear: {
            text: "Next Year",
            click: goToNextYear, // Event handler for clicking "Next Year" button
          },
        }}
        eventClick={handleEventClick} // Event handler for clicking an event
        eventClassNames="point" // Custom CSS class for events
        timeZone="UTC" // Timezone for the calendar
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }} // Time format for events
        viewDidMount={handleView} // Event handler for view change
        eventContent={renderEventContent} // Custom event content renderer
      ></FullCalendar>
      <ReservationModal />
    </div>
  );
}
