<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-none">
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav">
          <template v-if="$auth.loggedIn">
            <li>
              <nuxt-link :to="{ name:'home' }" class="nav-item nav-link" exact exact-active-class="active">
                <strong>История</strong> <span class="sr-only">(current)</span>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name:'expenses' }" class="nav-item nav-link" >
                <strong>Добавить транзакцию</strong>
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name:'howItsWork' }" class="nav-item nav-link" >
                <strong>О приложении</strong>
              </nuxt-link>
            </li>
          </template>
          <template v-else>
            <li>
              <nuxt-link :to="{ name:'howItsWork' }" class="nav-item nav-link" >
                <strong>О приложении</strong>
              </nuxt-link>
            </li>
          </template>

          </ul>
          <ul  class="navbar-nav ml-auto">
            <template v-if="!$auth.loggedIn">
              <li> <nuxt-link :to="{ name:'register' }" class="nav-item nav-link" >
                <strong>Регистрация</strong>
              </nuxt-link>
              </li>
              <li> <nuxt-link :to="{ name:'login' }" class="nav-item nav-link " >
                <strong>Войти</strong>
              </nuxt-link>
              </li>
            </template>
            <template v-else>
              <li> <a @click.prevent="logout" href="#" class="nav-link" >
                <strong>Выход</strong>
              </a>
              </li>
            </template>

          </ul>
        </div>

    </nav>
  </header>
</template>

<script>
  export default {
    name: "TheHeader",
    methods: {
      async logout () {
        await this.$auth.logout()
      }
    }
  }
</script>

<style scoped lang="css">
  .nav-item {
    font-size: 20px;
    font-weight: bold;
  }
 a {
   font-size: 20px;
   font-weight: bold;
 }
</style>

