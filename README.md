# Enterprise Blockchain Technologies
![](https://img.shields.io/github/issues/hyperledger-labs/university-course)
![](https://img.shields.io/github/issues-raw/hyperledger-labs/university-course/help%20wanted)
![](https://img.shields.io/github/forks/hyperledger-labs/university-course)
![](https://img.shields.io/github/stars/hyperledger-labs/university-course)
![](https://img.shields.io/github/license/hyperledger-labs/university-course)
![](https://img.shields.io/github/v/release/hyperledger-labs/university-course)

<img src="./ebt.png" width="1000">

Welcome to Enterprise Blockchain Technologies, a **flexible, extensible, open-source course** 🎓

This course aims at providing a reliable basis for university students to get started in enterprise blockchain.

This course contains the practical part of a university course on enterprise blockchain technologies.
Typically, a university course is divided into **theory** and **laboratory** classes. The theory explains the theoretical foundations behind what is learned in the laboratories.


## At the end of this course, you will:

✅ Understand the theory on blockchain: what is it (<b>Lab 1, Lab2</b>), and which problems it can solve (<b>Lab 3</b>)

✅ Get to know Hyperledger Fabric's components in detail, such as architecture and transactional model (<b>Lab 4</b>), chaincode (<b>Lab 5</b>), network, and how to develop an enterprise full-stack blockchain decentralized application (<b>Lab 6</b>)

✅ Leverage Hyperledger Umbra to study advanced topics on Fabric (<b>Lab 7, Lab 8</b>)

## Course Organization

The course is divided into two modules:

* Module I introduces enterprise blockchain (labs 1-4)
* Module II focuses on Hyperledger Fabric (labs 5-8).

Each laboratory is assumed to take 1.5h, supported by a teaching assistant. All laboratories assume 3h of theory classes. Thus, this course could be organized as a 7.5 ECTS university course.

For example:
* Universities using trimesters, a course on enterprise technologies uses 1 module (4.5 weekly hours for \~ 3 months).

For universities using semesters, a course on enterprise technologies uses 2 modules (4.5 weekly hours for \~ 5 months).


This course is flexible because you can pick the laboratories you wish to complete across modules.
Currently, this course supports Hyperledger Fabric and Hyperledger Umbra but can be easily extended by adding modules.

## Table of Contents
| Module   | Lab Number   | Topic                                        | Contents                                                                                                                                                                                         | Support files        | Public Mirror |
|:------:  |:----------:  |-------------------------------------------   |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |--------------------- | -------------------- |
|    I     |   [Lab 01](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab01)       |    Fundamentals on Distributed Systems       | ➡️ Introduction to distributed systems<br><br>➡️Introduction on state machine replication<br><br>➡️Introduction to consensus<br><br>➡️RAFT algorithm                                                 |                      |  [Guide](https://www.overleaf.com/read/cmbrrpxctmqy) <br><br> [Instructor's Guide](https://www.overleaf.com/read/rzykfxvkcddk) |
|    I     |   [Lab 02](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab02)       | Fundamentals on Cryptography and Security    | ➡️Background on Cryptography: symmetric and asymmetric cryptography, and digital signatures<br><br>➡️Background on Security: authentication, authorization, accountability<br><br>➡️RSA algorithm    | [RSA implementation](https://github.com/hyperledger-labs/university-course/tree/master/support/Lab02)  |  [Guide](https://www.overleaf.com/read/ryynpwswvjby) <br><br> [Instructor's Guide](https://www.overleaf.com/read/rhtrpttqnvrf) |
|    I     |   [Lab 03](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab03)       |           A Primer on Blockchain             | ➡️Introduction to blockchain<br><br>➡️Public vs private blockchains                                                                                                                              | [Blockchain4Students](https://github.com/hyperledger-labs/university-course/tree/master/support/Lab03)   |  [Guide](https://www.overleaf.com/read/dhgvmqcmbvqs) <br><br> [Instructor's Guide](https://www.overleaf.com/read/ckwpzxwfknhd) |
|    I      |  [Lab 04](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab04)     | Introduction to Hyperledger Fabric            | ➡️The Hyperledger Ecosystem <br><br> ➡️A Technical Viewpoint on Fabric <br><br> ➡️A Use Case for Education: Blockchain4Students QUC | |  [Guide](https://www.overleaf.com/read/hmbwtzrttdss) <br><br> [Instructor's Guide](https://www.overleaf.com/read/jrgktympsxgp) ||
|    II      |  [Lab 05](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab05)     | Hyperledger Fabric: Infrastructure and Chaincode            | ➡️ The B4S QUC System <br><br> ➡️ Smart Contracts & Chaincode <br><br> ➡️  Setting up B4S | [Blockchain4Students Fabric Version](https://github.com/hyperledger-labs/university-course/tree/master/support/Lab05)     |  [Guide](https://www.overleaf.com/read/chgphhmydmsp) <br><br> [Instructor's Guide](https://www.overleaf.com/read/qpynfjfnvyts) |
|    II      |  [Lab 06](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab06)     | Hyperledger Fabric: Full-stack dApp            | ➡️Blockchain Network <br><br> ➡️B4S Web App 6 User interface | [Blockchain4Students Fabric Version + Blockchain Client](https://github.com/hyperledger-labs/university-course/tree/master/support/Lab06)   | [Guide](https://www.overleaf.com/read/fxmnckhwqjqs) <br><br> [Instructor's Guide](https://www.overleaf.com/read/gsqjghvfdcsg) |
|    II      |  [Lab 07](https://github.com/hyperledger-labs/university-course/tree/master/source/Lab07)     | Hyperledger Umbra: Introduction            | ➡️Introduction to Hyperledger Umbra <br>➡️Simple scenario setting | [Support Code](https://github.com/hyperledger-labs/university-course/tree/master/support/Lab07)    | [Guide](https://www.overleaf.com/read/sjxvntvwzpvg) <br><br> [Instructor's Guide](https://www.overleaf.com/read/nxygmpvkzjmr) |
|    II      |  Lab 08     | TBD            | TBD | Support Code |  Guide <br><br> Instructor's Guide|
|    MODULE C     |  LAB X    | CLASS ON Y            | CONTENTS Z |  SUPPORT MATERIALS W   | Guides |

## Folder organization
`docs` - contains rendered labs

`source` - contains the LaTeX sources for the labs and theory classes.

`support` - contains the support files for the labs.

## I want to attend this course
To participate in the course, do the following:
1. Fork this repository via Github UI.
2. Clone the repository to your machine: git clone https://github.com/YOUR_USERNAME/university-course
2. Access the guides (Guide and Instructor's Guide) either by:
    1. Public Mirrors (see the table of contents)
    3. Compile them at Overleaf or using a local LaTeX distribution. Create a .zip for the lab you want to attend. Upload that .zip to Overleaf [following these instructions](https://www.overleaf.com/learn/how-to/Uploading_a_project).
    3. Release files (contain compiled PDFs)

3. Do the lab. In case of doubts, open an issue [at the official repository](https://github.com/hyperledger-labs/university-course/issues) with the label "lab-question." In case of bugs, open an issue with the "bug" label.
4. The solutions are in the Instructors Guide file, available via step 3.
5. Share with your colleagues and provide feedback!



## I want to teach this course
To teach this course, do the following steps:
1. Fork this repository via Github UI.
2. Clone the repository to your machine: git clone https://github.com/YOUR_USERNAME/university-course
2. Access the guides (Guide and Instructor's Guide):
    1. Using Overleaf. Create a .zip for the lab you want to attend. Upload that .zip to Overleaf [following these instructions](https://www.overleaf.com/learn/how-to/Uploading_a_project).
    2. Change the guides as needed (e.g., university logo, course's name, dates, etc.).
    3. Compile and download.

3. You can also leverage the support files for your students to experiment. In case of doubts, open an issue [at the official repository](https://github.com/hyperledger-labs/university-course/issues) with the label "lab-question". In case of bugs, open an issue with the "bug."
5. Share with your students and provide feedback!

## I want to create my own materials and contribute to this course
This course is not a finished product and needs contributions. Your contributions are very welcome! 🎉🎉

Note that contributions are not only code! There are a lot of tasks to build a successful open-source course for everyone. Generally, look for [issues tagged with **help-wanted**](https://github.com/hyperledger-labs/university-course/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22). You can help to improve this project in the following ways:

1. Extend the course to other enterprise blockchain technologies. This can be done by adding a new Module. Since this course is modular, people, universities, and other learning institutions can build a customized course using various modules.
Examples: Corda, Hyperledger Besu, Hyperledger Cactus, Hyperledger Sawtooth, Hyperledger Iroha, Cosmos, Polkadot, DAML.

2. Visually teach this course (e.g., YouTube tutorials, crash courses, Posters, flyers). You can use these materials for that!

3. Complete the current laboratories, as some labs are not 100% finalized. Some improvement options are present on the [issues page](https://github.com/hyperledger-labs/university-course/issues).

4. Help improve the design of the lab guides.

5. Maintaining and disseminating this project. Contributions to disseminate and manage this project are welcome. Please contact Rafael Belchior <rafael.belchior (at) tecnico (dot) ulisboa (dot) pt>.

6. Contribute with technical expertise in the form of small articles, such as this [introduction to the Libra Blockchain](https://towardsdatascience.com/the-libra-blockchain-technical-overview-part-i-5e872b0369c) or this [2020 review on blockchain interoperability](https://medium.com/coinmonks/blockchain-interoperability-in-2020-a-4-minute-review-e9589b1b1808). Such articles can be added to a special module, in which students read and discuss them.

7. Add theory (slides, presentations, small videos) that can be used to complement the labs.

To contribute code, documentation, and others, please check the [contributing guide](https://github.com/hyperledger-labs/university-course/blob/master/CONTRIBUTING.md).


## List of contributors
* Rafael Belchior <rafael.belchior (at) tecnico (dot) ulisboa (dot) pt>
* Catarina Pedreira <catarina.pedreira (at) tecnico (dot) ulisboa (dot) pt>
* Iulia Mihaiu <iulia.mihaiu (at) student (dot) unitbv (dot) ro>
* Rafael Soares <joao.rafael.pinto.soares (at) tecnico (dot) ulisboa (dot) pt>
* Raphael Rosa (Raphaelvrosa) via the Hyperledger Umbra project
* banoris via the Hyperledger Umbra project

## A list of university-level blockchain courses:

| Focus               	| Course Name                                     	| University                	| Country      	|
|---------------------	|-------------------------------------------------	|---------------------------	|--------------	|
| Private  	| Enterprise Blockchain Technologies              	| Técnico Lisboa*           	| Portugal 🇵🇹  	|
| Public   	| [CS 481A3 BLOCKCHAIN PRINCIPLES AND APPLICATIONS](https://www.cs.colostate.edu/~cs458/#/) 	| Colorado State University 	| USA 🇺🇸       	|
|     Public                	|       [Blockchain-based Systems Engineering](https://github.com/sebischair/bbse)                                          	|    Technical University of Munich                        	|    Germany 🇩🇪          	|

* created by Rafael Belchior, Ph.D. student and Teaching Assitant at Técnico Lisboa

Legend:

Focus: **Public** Blockchains / **Private** Blockchains / Both

## Acknowledgements

This project is part of [Hyperledger Labs](https://www.hyperledger.org/blog/2018/01/23/introducing-hyperledger-labs) and [Hyperledger Summer Internships](https://wiki.hyperledger.org/display/INTERN/Project+Plan+-+Build+a+university+course+on+Hyperledger+Fabric+using+Hyperledger+Umbra).

This project is idealized and greatly supported by:
- David Huseby - <dhuseby (at) linuxfoundation (dot) org>
