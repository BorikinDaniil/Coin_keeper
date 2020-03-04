<template>

  <div class="container">
    <h1>Доход</h1>
    <table class="table" >
      <tr class="text">
        <td @click.prevent="sortTable('name')"><strong>Доход</strong></td>
        <td @click.prevent="sortTable('username')"><strong>Сумма</strong></td>
      </tr>
      <tr v-for="income of incomes">
        <td>
          {{ income.whence }}
        </td>
        <td>
          {{ income.sum }}
          <button @click.prevent.stop="onDelete(income)" class="close">
            x
          </button>
        </td>
      </tr>
    </table>
    <div>
    </div>
    <button @click.prevent="isHidden = !isHidden" class="btn btn-light btn-outline-primary" v-b-modal.2 >
      Submit new income
    </button>
    <div  v-if="!isHidden">
      <form id="2" @submit.prevent="onSubmit" >
        <div class="form-group">
          <label for="name">Доход</label>
          <input id="name" v-model="income.whence" type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="username">Сумма</label>
          <input id="username" v-model="income.sum" type="text" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<script>
  let oldColumn = '';
  let flag = 'asc';
  export default {
    name: 'obligatoryExpence',
    data: () => ({
      income: {
        whence: '',
        sum: '',
      },
      isHidden: true,
      currentIncome: null
    }),
    async asyncData({$axios}) {
      let incomes = []
      try {
        incomes = await $axios.$get('/incomes')
      } catch (e) {
        console.log(e)
      }
      return {incomes}
    },
    methods: {
      async sortTable(param) {
        try {
          flag = (param === oldColumn) ? (flag === 'desc' ? 'asc' : 'desc') : 'asc'
          this.users = await this.$axios.$get(`/users?_sort=${param}&_order=${flag}`)
          oldColumn = param
        } catch (e) {
          console.log(e)
        }

      },
      onShowUser(income) {
        this.currentIncome = income
        this.isHidden = false
      },
      async onDelete(income) {
        const message = `Delete ${income.whence}?`
        if (window.confirm(message)) {
          try {
            await this.$axios.$delete(`/users/${income.id}`)
            const index = this.incomes.findIndex(u => u.id === income.id)
            this.incomes.splice(index, 1)
          } catch (e) {
            console.log(e)
          }
        }
      },
      async onSubmit() {
        try {
          const newIncome = await this.$axios.$post('/incomes', this.income)
          this.incomes.push(newIncome)
        } catch (e) {
          console.log(e)
        }
      },
      onShowForm() {
        this.currentIncome = null
        this.isHidden = false
      }
    }
  }
</script>

<style scoped lang="css">

  .table {
    border: 4px solid #000;

  .close {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 32px;
    height: 32px;
    opacity: 0.3;
  }
  .close:hover {
    opacity: 1;
  }
  .close:before, .close:after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }

  }


  .form-group {
    width: 250px;
  }





</style>
