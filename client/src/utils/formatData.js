import toast from "react-hot-toast";

export const formatChartData = (dataObj, allBookings, availableGuides) => {
  let DATA_ARRAY = allBookings.find(
    (doc) => doc.year === dataObj.year
  ).bookings;

  const DATA_OBJ = { ...dataObj };

  const toastId = toast.loading("Loading...");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  for (const [KEY, VALUE] of Object.entries(DATA_OBJ)) {
    if (
      VALUE === "all" ||
      VALUE === "" ||
      VALUE === undefined ||
      VALUE === null
    ) {
      delete DATA_OBJ[KEY];
    }
  }

  DATA_ARRAY = DATA_ARRAY.filter((booking) => {
    for (const [key, value] of Object.entries(DATA_OBJ)) {
      if (key === "year") {
        if (value !== new Date(booking.start).getFullYear()) return false;
      } else if (key === "month") {
        if (value !== new Date(booking.start).getMonth()) return false;
      } else if (key === "status") {
        if (value !== booking.status) return false;
      } else if (key === "guide") {
        const guide = availableGuides.find((el) => el.fullName === value);

        if (guide._id !== booking.guide) return false;
      }
    }
    return true;
  });

  if (DATA_ARRAY.length < 1) {
    toast.error("No booking found with the provided options. ");
    toast.dismiss(toastId);
    return [];
  } else if (!DATA_OBJ.month) {
    const allYearData = [
      {
        name: "Jan",
        amount: 0,
        index: 0,
      },
      {
        name: "Feb",
        amount: 0,
        index: 1,
      },
      {
        name: "Mar",
        amount: 0,
        index: 2,
      },
      {
        name: "Apr",
        amount: 0,
        index: 3,
      },
      {
        name: "May",
        amount: 0,
        index: 4,
      },
      {
        name: "Jun",
        amount: 0,
        index: 5,
      },
      {
        name: "Jul",
        amount: 0,
        index: 6,
      },
      {
        name: "Aug",
        amount: 0,
        index: 7,
      },
      {
        name: "Sept",
        amount: 0,
        index: 8,
      },
      {
        name: "Oct",
        amount: 0,
        index: 9,
      },
      {
        name: "Nov",
        amount: 0,
        index: 10,
      },
      {
        name: "Dec",
        amount: 0,
        index: 11,
      },
    ];

    DATA_ARRAY.map((booking) => {
      return allYearData.map((doc) => {
        if (new Date(booking.start).getMonth() === doc.index) {
          doc.amount++;
        }
        return doc;
      });
    });
    toast.dismiss(toastId);
    return allYearData;
  } else {
    const key = months[DATA_OBJ.month];

    const data = [{ [`${key}`]: 0, amount: 0, index: DATA_OBJ.month }];

    DATA_ARRAY.map((booking) => {
      if (new Date(booking.start).getMonth() === data[0].index) {
        data[0].amount++;
      }
      return booking;
    });

    toast.dismiss(toastId);
    return data;
  }
};
