<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <h3 class="text-center">Update Student</h3>
      <form @submit.prevent="handleUpdateForm">
        <div class="mb-3">
          <label>Name</label>
          <input type="text" class="form-control" v-model="student.name" required>
        </div>
        <div class="mb-3">
          <label>Email</label>
          <input type="email" class="form-control" v-model="student.email" required>
        </div>
        <div class="mb-3">
          <label>Phone</label>
          <input type="text" class="form-control" v-model="student.phone" required>
        </div>
        <div class="mb-3">
          <button class="btn btn-danger btn-block">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      student: {}
    }
  },
  created() {
    let apiURL = `http://localhost:4000/api/edit-student/${this.$route.params.id}`;
    axios.get(apiURL).then((res) => {
      this.student = res.data.data;
    })
  },
  methods: {
    handleUpdateForm() {
      let apiURL = `http://localhost:4000/api/update-student/${this.$route.params.id}`;
      axios.put(apiURL, this.student).then((res) => {
        console.log(res)
        this.$router.push('/view')
      }).catch(error => {
        console.log(error)
      });
    }
  }
}
</script>