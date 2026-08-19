# Domain overview

The main purpose of this application is to manage some operations of a small music school by replacing manual paperwork with automated software.

## Features
- Register students and enroll them in music courses
- Manage instrument loans for enrolled students
- Track student payments across multiple courses

## Business questions
- How many students are currently enrolled this year and how are they distributed across courses and modalities?
- How many instruments are currently on loan? Are they loaned to enrolled (active) students?
- What is the current payment status of each enrollment?
- Which enrollments are locked with an instrument that hasn't been returned yet?

## Glossary
- **Student:** a person to be enrolled in one or more music courses
- **Church:** the church that a student attends
- **Course:** The subject a student studies (discipline), such as: clarinet course, violin course and flute course
- **Modality:** The class format. Can be **Individual** or **Group**. Each one has its fixed tuition.
- **Class plan:** The valid combination of a course and a modality (for example "Violin, Group"). Not every course offers both modalities. A class plan exists only for the combinations the school actually offers.
- **Enrollment:** The link between a student and a class plan. This is the
  central record of the system. Payment status and lock status belong to
  the enrollment, not to the student directly, since a student can be up
  to date on one course and late on another.
- **Instrument:** Asset loaned by the school to a student tied to a specific enrollment. For example: a clarinet is loaned to a student enrolled in the clarinet course
- **Tuition:** Monthly fee charged to a student enrolled in a course.

## Non-goals

Intentionally left out of scope for the MVP

- Integration with WhatsApp
- In-app payment processing
- Class scheduling
- Student self-service portal
- Multi-school support
- Tax / fiscal reporting
- Native mobile app