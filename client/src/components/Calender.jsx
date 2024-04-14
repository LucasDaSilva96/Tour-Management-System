import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSelectedBooking,
  setAllBookings,
  toggleReservationModal,
  getAllBookings,
} from "../redux/bookingSlice";
import ReservationModal from "./ReservationModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCurrentUser } from "../redux/userSlice";
import Loading from "../pages/Loading";
import AlertComponent from "./AlertNotis";
import { useNavigate } from "react-router-dom";
const today = dayjs();

export default function Calendar() {
  const bookings = useSelector(getAllBookings);
  const user = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: [`${today.get("year")}-bookings`],
    queryFn: () =>
      axios
        .get(
          `http://localhost:8000/api/v1/tours/bookings?year=${today.get(
            "year"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          dispatch(setAllBookings(res.data.result));
          return res.data;
        }),
  });

  const calendarRef = useRef(null);

  const goToPrevYear = () => {
    calendarRef.current.getApi().prevYear();
  };

  const goToNextYear = () => {
    calendarRef.current.getApi().nextYear();
  };

  const handleEventClick = (clickInfo) => {
    dispatch(toggleReservationModal());
    dispatch(
      setCurrentSelectedBooking({
        ...clickInfo.event._def.extendedProps,
        title: clickInfo.event._def.title,
        start: new Date(clickInfo.event._instance.range.start).toISOString(),
        end: new Date(clickInfo.event._instance.range.end).toISOString(),
      })
    );
  };

  const handleAddNewEventClick = (clickInfo) => {
    return navigate(`newReservation/${clickInfo.dateStr}`);
  };

  const handleView = (view) => {
    localStorage.setItem("view", view.view.type);
  };

  if (isPending) return <Loading />;
  if (error)
    return <AlertComponent type="error">{error.message}</AlertComponent>;
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
      ></FullCalendar>
      <ReservationModal />
    </div>
  );
}
