<template>
  <div>
    <h1>Звітність</h1>

    <div class="filters">
      <label for="month">Виберіть місяць:</label>
      <select id="month" v-model="selectedMonth" @change="filterData">
        <option value="">Всі місяці</option>
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.name }}
        </option>
      </select>

      <label for="day">Виберіть день:</label>
      <input type="date" id="day" v-model="selectedDay" @change="filterData" />
    </div>

    <table v-if="filteredActivities.length">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Активність</th>
          <th>Періоди</th>
          <th>Тривалість</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(activity, index) in filteredActivities" :key="index"> <!-- перебирає кожен елемент масиву filteredActivities та додає в таблицю -->
          <td>{{ activity.date }}</td>
          <td>{{ activity.name }}</td>
          <td>
            <div v-for="(period, i) in activity.timePeriods" :key="i">
              {{ formatTime(period.start) }} - {{ formatTime(period.end) }}
            </div>
          </td>
          <td>
            <div v-for="(period, i) in activity.timePeriods" :key="i">
              {{ period.duration ? period.duration + " сек" : "-" }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Немає активностей для цього фільтру</p>
  </div>
</template>

<script>
export default {
  name: "ActivityReports",
  data() {
    return {
      selectedMonth: "",
      selectedDay: "",
      activities: [],
      filteredActivities: [],
      months: [
        { name: "Січень", value: "01" },
        { name: "Лютий", value: "02" },
        { name: "Березень", value: "03" },
        { name: "Квітень", value: "04" },
        { name: "Травень", value: "05" },
        { name: "Червень", value: "06" },
        { name: "Липень", value: "07" },
        { name: "Серпень", value: "08" },
        { name: "Вересень", value: "09" },
        { name: "Жовтень", value: "10" },
        { name: "Листопад", value: "11" },
        { name: "Грудень", value: "12" },
      ],
    };
  },
  methods: {
    loadActivities() {
      const storedActivities = localStorage.getItem("activities"); /* отримує дані, які були збережені в localStorage під ключем "activities" */
      this.activities = storedActivities ? JSON.parse(storedActivities) : [];/*  перетворення JSON-рядка в масив (або створення порожнього масиву) */
      const currentMonth = new Date().getMonth() + 1;
      this.selectedMonth = String(currentMonth).padStart(2, "0"); 
      /* String(currentMonth) перетворює число в рядок.
      .padStart(2, "0") додає нуль на початок, якщо число складається з однієї цифри (наприклад, "2" → "02").
      Це потрібно для узгодження формату MM (місяць у двох знаках). */
      this.filterData();
    },

    filterData() {
      let activities = [...this.activities]; /* копія масиву activities */

      if (this.selectedMonth) {
        activities = activities.filter((activity) => {
          const month = activity.date.split(".")[1]; /* витягує місяць із дати у форматі "ДД.ММ.РРРР" */
          return month === this.selectedMonth;
        });
      }

      if (this.selectedDay) {
        const formattedDay = this.formatDateToDDMMYYYY(this.selectedDay);
        activities = activities.filter((activity) => activity.date === formattedDay);
      }

      this.filteredActivities = activities; /* зберігає результат у filteredActivities */
    },

    formatDateToDDMMYYYY(date) {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}.${month}.${year}`;
    },

    formatTime(date) { /* форматує час у години:хвилини */
      const options = { hour: "2-digit", minute: "2-digit" }; 
      return new Date(date).toLocaleTimeString("uk-UA", options);
    },
  },
  created() {  /* loadActivities() викликається одразу при завантаженні сторінки, щоб отримати активності з localStorage */
    this.loadActivities(); 
  },
};
</script>
