<template>
  <div class="all">
    <div class="sumToday" v-if="expensesBeforeToday() > 0">
    <h4 >Доступная сумма на сегодня : {{  expensesBeforeToday() }}UAH</h4>
  </div>
      <div class="sumTodayMinus" v-if="expensesBeforeToday() <= 0">
        <h4 >Доступная сумма на сегодня : {{  expensesBeforeToday() }}UAH</h4>
      </div>
    <validation-observer ref="signUnpForm" v-slot="{ handleSubmit }" class="container h-100vh" tag="div">
    <form class="decor" @submit.prevent="handleSubmit(onSubmitExpense)">
      <div class="form-left-decoration"></div>
      <div class="form-right-decoration"></div>
      <div class="circle"></div>
      <div class="form-inner">
        <nuxt-link :to="{ name:'expenses' }" class="navbar-brand" exact exact-active-class="active">
          Добавить расход
        </nuxt-link>
        <nuxt-link :to="{ name:'incomes' }" class="navbar-brand" exact exact-active-class="active">
          Добавить доход
        </nuxt-link>
        <validation-provider v-slot="{ errors, classes }" name="Категория расхода" rules="required" tag="div" class="form-group">
          <input
            id="Категория расхода"
            v-model="expense.name"
            :class="classes"
            name="Категория расхода"
            type="text"
            class="form-control"
            placeholder="Категория расхода">
          <div class="invalid-feedback">
            <strong>{{ errors[0] }}</strong>
          </div>
        </validation-provider>
        <validation-provider v-slot="{ errors, classes }" name="Сумма" rules="required" tag="div" class="form-group">
          <input
            id="Сумма"
            v-model="expense.sum"
            :class="classes"
            name="Сумма"
            type="number"
            class="form-control"
            placeholder="Сумма">
          <div class="invalid-feedback">
            <strong>{{ errors[0] }}</strong>
          </div>
        </validation-provider>
        <input type="submit" value="Сохранить">
      </div>
    </form>
    </validation-observer>
    <h4 v-if="getCurrMonthAndDayExpenses().length > 0">
      Список расходов зa день:
    </h4>
    <ol>
      <li v-for="expense of getCurrMonthAndDayExpenses()">
        {{ expense.date }} - {{ expense.name }} - {{ expense.sum }} UAH
        <button @click.prevent="onDelete(expense)" class="close">
          x
        </button>
      </li>
    </ol>
    <h3 v-if="getTotalToday() !== 0">Cумма расходов за день - {{ getTotalToday() }} UAH </h3>
  </div>
    </template>

  <script>
      import moment from "moment";
      import {mapGetters} from "vuex";
      export default {
        name: 'expenses',
        data: () => ({
          expense: {
            name: '',
            sum: '',
            date: null
          },
        }),
        computed: mapGetters({
          incomes: 'incomes/getIncomes',
          date: 'date/getDate',
          deffers: 'deffer/getDeffers'
        }),
        async fetch({store}) {
          await store.dispatch('incomes/loadIncomes')
          await store.dispatch('deffer/loadDeffers')

        },
        async asyncData({$axios}) {
          let expenses = []
          try {
            expenses = await $axios.$get('/expenses')
          } catch (e) {
            console.log(e)
          }
          return {expenses}
        },
        methods: {
          async onDelete(expense) {
            const message = `Удалить запись ${expense.name}?`
            if (window.confirm(message)) {
              try {
                await this.$axios.$delete(`/expenses/${expense.id}`)
                const index = this.expenses.findIndex(u => u.id === expense.id)
                this.expenses.splice(index, 1)
              } catch (e) {
                console.log(e)
              }
            }
          },
          async onSubmitExpense() {
            if (await this.$refs.signUnpForm.validate()) {
              try {
                this.expense.date = moment(this.date).format("DD.MM.YYYY");
                const newExpense = await this.$axios.$post('/expenses', this.expense)
                this.expenses.push(newExpense)
              } catch (e) {
                console.log(e)
              }
            }
          },
          getCurrMonthExpenses() {
            const CurrMonthExpenses = this.expenses.filter(expense =>
              moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month')
            )
            return CurrMonthExpenses
          },
          getCurrMonthIncomes() {
            const CurrMonthIncomes = this.incomes.filter(income =>
              moment(income.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month'))
            return CurrMonthIncomes
          },
          getCurrMonthAndDayExpenses() {
            const CurrMonthAndDayExpenses = this.getCurrMonthExpenses().filter(expense =>
              moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'day')&&
              moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month')
            )
            return CurrMonthAndDayExpenses
          },
          getTotal() {
            let totalSum = 0;
            this.getCurrMonthExpenses().forEach(i => totalSum += +i.sum)
            return totalSum
          },
          getDailyMoney() {
            let totalSum = 0;
            let totalDeffer = 0;
            this.getCurrMonthIncomes().forEach(i => totalSum += +i.sum);
            let curentDeffer =  this.deffers.filter(d =>
              moment(d.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'month'));
            curentDeffer.forEach(i => totalDeffer += +i.sum);
            totalSum -= totalDeffer;
            return Math.round(totalSum / moment(this.date).daysInMonth())
          },
        expensesBeforeToday() {
          const CurrMonthIncomes = this.getCurrMonthIncomes();
          const expensesBefore = this.getCurrMonthExpenses().filter(expense =>
            moment(expense.date, "DD.MM.YYYY").isBefore(moment(this.date, "DD.MM.YYYY"), 'date') ||
            moment(expense.date, "DD.MM.YYYY").isSame(moment(this.date, "DD.MM.YYYY"), 'date'))
          let totalSumExpenses = 0;
          const incomesBeforeOfDay = this.getDailyMoney() * moment(this.date).date();
          expensesBefore.forEach(i => totalSumExpenses += +i.sum)
          return incomesBeforeOfDay - totalSumExpenses;
        },
          getTotalToday() {
            let totalSum = 0;
            this.getCurrMonthAndDayExpenses().forEach(i => totalSum += +i.sum)
            return totalSum
          }
        }
      }


    </script>

    <style scoped lang="css">

      .all {
        width: auto;
        min-width: 550px;
        height: auto;
        position: absolute;
        top: 35%;
        left: 40%;
        margin: -125px 0px 0 -125px;
        margin-bottom: 50px;
      }
      .navbar-brand {
        color: black;
      }
      input {
        opacity: 0.7;
        font-weight: bold;
      }
      ul {
        margin-top: 15px;
      }
      strong {
        font-size: large;
      }
      button {
        font-weight: bolder;
      }
      .sumToday {
        padding: 5px;
        margin-bottom: 20px;
        background: #ECE9E0;
        border-radius: 10px;
        text-align: center;
        color: black;
      }
      .sumTodayMinus {
        padding: 5px;
        margin-bottom: 20px;
        background: red;
        border-radius: 10px;
        text-align: center;
        color: white;
      }

      .decor {
        position: relative;
        max-width: 500px;
        margin: 0px auto 0;
        background:white;
        border-radius: 30px;
      }
      .form-left-decoration,
      .form-right-decoration {
        content: "";
        position: absolute;
        width: 50px;
        height: 20px;
        background: #707981;
        border-radius: 20px;
      }
      .form-left-decoration {
        bottom: 60px;
        left: -30px;
      }
      .form-right-decoration {
        top: 60px;
        right: -30px;
      }
      .form-left-decoration:before,
      .form-left-decoration:after,
      .form-right-decoration:before,
      .form-right-decoration:after {
        content: "";
        position: absolute;
        width: 50px;
        height: 20px;
        border-radius: 30px;
        background: white;
      }
      .form-left-decoration:before {top: -20px;}
      .form-left-decoration:after {
        top: 20px;
        left: 10px;
      }
      .form-right-decoration:before {
        top: -20px;
        right: 0;
      }
      .form-right-decoration:after {
        top: 20px;
        right: 10px;
      }
      .circle {
        position: absolute;
        bottom: 80px;
        left: -55px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
      }
      .form-inner {padding: 50px;}
      .form-inner input,
      .form-inner textarea {
        display: block;
        width: 100%;
        padding: 0 20px;
        margin-bottom: 10px;
        background: #E9EFF6;
        line-height: 40px;
        border-width: 0;
        border-radius: 20px;
        font-family: 'Roboto', sans-serif;
      }
      .form-inner input[type="submit"] {
        margin-top: 30px;
        background: #707981;
        border-bottom: 4px solid #707981;
        color: white;
        font-size: 14px;
      }
      .form-inner h3 {
        margin-top: 0;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 24px;
        color: #707981;}
    </style>
