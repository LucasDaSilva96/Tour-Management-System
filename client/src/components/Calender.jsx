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
  const bookings = useQueryClient().getQueryData(["AllBookings"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendarRef = useRef(null);

  const goToPrevYear = () => {
    calendarRef.current.getApi().prevYear();
  };

  const goToNextYear = () => {
    calendarRef.current.getApi().nextYear();
  };

  const handleEventClick = (clickInfo) => {
    const selectedBooking = bookings.find(
      (el) => el._id === clickInfo.event.extendedProps._id
    );
    dispatch(toggleReservationModal());
    dispatch(setCurrentSelectedBooking(selectedBooking));
  };

  const handleAddNewEventClick = (clickInfo) => {
    const dateClicked = new Date(clickInfo.dateStr).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    const isBefore = dayjs(dateClicked).isBefore(dayjs(today));

    if (!isBefore || dateClicked.toLocaleString() === today.toLocaleString()) {
      return navigate(`newReservation/${clickInfo.dateStr}`);
    } else {
      return toast.error("A new booking can't take place in the past.");
    }
  };

  const handleView = (view) => {
    localStorage.setItem("view", view.view.type);
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
      <FullCalendar
        themeSystem="bootstrap5"
        dateClick={handleAddNewEventClick}
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView={localStorage.getItem("view")}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to false for 24-hour format
        }}
        height={"80dvh"}
        events={bookings}
        eventDisplay="block"
        headerToolbar={{
          start: "dayGridMonth,timeGridWeek,timeGridDay",
          center: "title",
          end: "today,prev,prevYear,next,nextYear,custom2",
        }}
        customButtons={{
          prevYear: {
            text: "Prev Year",
            click: goToPrevYear,
          },
          nextYear: {
            text: "Next Year",
            click: goToNextYear,
          },
        }}
        eventClick={handleEventClick}
        eventClassNames="point"
        timeZone="UTC"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        viewDidMount={handleView}
        eventContent={renderEventContent}
      ></FullCalendar>
      <ReservationModal />
    </div>
  );
}
