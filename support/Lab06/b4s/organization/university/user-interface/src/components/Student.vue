<template>
    <div>

            <md-card md-with-hover>
                <md-ripple>
                    <md-card-header>
                        <div class="md-title">Student  {{student.studentId}}</div>
                        <div class="md-subhead">From University: {{student.universityId}}</div>
                    </md-card-header>

                    <md-card-actions>
                        <md-button class="md-primary md-raised" @click="showDialog = true">Show All</md-button>

                    </md-card-actions>
                </md-ripple>
            </md-card>

        <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>Student  {{student.studentId}}</md-dialog-title>

            <md-tabs md-dynamic-height>
                <md-tab md-label="General">
                    <p>ID: {{student.studentId}}</p>
                    <p>University ID: {{student.universityId}}</p>
                    <p>Courses: {{student.enrolledCourses}}</p>


                </md-tab>

            </md-tabs>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showDialog = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>

    </div>
</template>

<script>


    export default {
        name: "Student",
        props: ["student"],
        data () {
            return  {
                date: new Date(),
                showDialog: false
            }
        },
        methods ()  {


        },
        created() {
        }
    }
</script>

<style scoped>

</style>