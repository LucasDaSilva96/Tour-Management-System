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
const today = dayjs();

export default function Calendar() {
  const bookings = useSelector(getAllBookings);
  const user = useSelector(getCurrentUser);
  const dispatch = useDispatch();

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
    // dispatch(
    //   setCurrentSelectedBooking({
    //     ...clickInfo.event,
    //     start: new Date(clickInfo.event.start).toISOString(),
    //     end: new Date(clickInfo.event.end).toISOString(),
    //   })
    // );

    // console.log("Event:", clickInfo.event);
    // console.log("Event Title:", clickInfo.event.title);
    // console.log("Event Start:", clickInfo.event.start);
    // console.log("Event End:", clickInfo.event.end);
    // console.log(
    //   "Event Description:",
    //   clickInfo.event.extendedProps.description
    // );
    // You can access other event properties similarly
  };

  if (isPending) return <Loading />;
  if (error)
    return <AlertComponent type="error">{error.message}</AlertComponent>;
  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to false for 24-hour format
        }}
        height={"80dvh"}
        events={bookings}
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
      />
      <ReservationModal />
    </div>
  );
}
