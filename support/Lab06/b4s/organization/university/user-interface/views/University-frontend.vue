<template>
  <div id="audit">


    <div class="md-layout md-gutter md-alignment-center">
      <div class="md-layout-item">
        <md-empty-state
            class="md-primary"
            md-label="Retrieve students"
            md-description="Retrieve all students from the blockchain">
          <md-button v-on:click="start()" class="md-fab md-primary">
            <md-icon>Start</md-icon>
          </md-button>
          <md-progress-spinner v-if="clicked" class="md-primary" md-mode="indeterminate"></md-progress-spinner>
          <p> {{startError}}</p>

        </md-empty-state>
        <div class="md-layout md-gutter md-alignment-center">
          <div class="md-layout-item">
            <md-empty-state
                class="md-primary"
                md-label="Query Students"
                md-description="Search by studentId">
              <input type="text" v-model="search" placeholder="Please insert an ID"/>
            </md-empty-state>
          </div>
        </div>
        <div  v-bind:key="student.studentId" v-for="student in filteredstudents">
          <Student v-bind:student="student" />
        </div>


      </div>

    </div>


  </div>
</template>

<script>
import axios from "axios";
import Student from '../src/components/Student'

export default {
  name: 'University Frontend',
  components: {Student},
  data()  {
    return  {
      search: '',
      students: [],
      endResult: "",
      startError: "",
      server: "http://localhost:3001/",
      clicked: false,
      endClicked: false
    }
  },
  computed: {
    filteredstudents: function()  {
      return this.students.filter((student) =>  {
        return student.studentId.match(this.search)
      });
    }
  },
  methods:  {
    start () {
      console.log("obtaining students")
      this.clicked = true;
      this.endResult = "";
      axios.get(this.server + 'users/getAllStudents').then( res => {
        console.log(res);
        if (res.data.error) {
          this.startError = res.data.message;
          this.clicked = false;
          return;
        }
        this.students = res.data;
        console.log(this.students)
        this.clicked = false;
      }).catch( err => console.log(err));
    },

  },
  created() {
  }

}
</script>

<style>

</style>
