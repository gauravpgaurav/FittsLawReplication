# FittsLawReplication

Fitts's Law is an observed model that explains speed-accuracy trade-off features of human’s muscle movement with some analogy to Shannon’s channel capacity theorem. This application is a tool to validate the law.

## Steps to Execute Application
1. Clone/Download the repository.
2. Launch index.html in any browser.

## Steps to Modify Application
1. To change the number of targets use variable `numberOfTargets` in the `targetScript.js`
2. Values of size of targets & distance between targets can be modified using `inner_Radius_Array` & `outer_Radius_Array` respectively.

**Assumption** : _Only even_ number of targets can be provided to the application.

## Sample Screenshots
The main screen of the application:
![Alt text](/screenshots/mainScreen.png?raw=true "Main Screen")

Movement Time (MT) vs Index of Difficulty (ID)
![Alt text](/screenshots/result1.png?raw=true "Result 1")

Throughput (TP) vs Index of Difficulty (ID)
![Alt text](/screenshots/result2.png?raw=true "Result 2")
