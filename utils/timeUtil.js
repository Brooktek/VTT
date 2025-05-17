// geminie/utils/timeUtil.js

export const generateTimeSlots = () => {
  const slots = [];

  const startHourOffset = 6; 
  for (let i = 0; i < 48; i++) {
    const totalMinutes = (startHourOffset * 60) + (i * 30);
    const currentHour24 = Math.floor(totalMinutes / 60) % 24;
    const currentMinuteValue = totalMinutes % 60;

    const formatHour12Display = (h24) => {
      const h = h24 % 12 === 0 ? 12 : h24 % 12;
      return h;
    };

    const getPeriod = (h24) => (h24 >= 12 ? 'PM' : 'AM');

    const startTimeDisplay = `${formatHour12Display(currentHour24)}:${currentMinuteValue === 0 ? '00' : '30'} ${getPeriod(currentHour24)}`;

    const slotId = `slot-${currentHour24}-${currentMinuteValue}`;

    slots.push({
      id: slotId,
      displayText: startTimeDisplay,
    });
  }

  return slots;
};



