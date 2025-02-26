import styled from "styled-components";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "../firebase";

var Arr = [];

// this array stores index information about soldiers
var soldier_id = new Array(100);
var cur_index = 1;


// check array for availability 
var limit = new Array(100);
for (var i = 0; i < 100; i++) {
  limit[i] = new Array(7);
  for (var j = 0; j < 7; j++) {
    limit[i][j] = new Array(20);
    for (var k = 0; k < 20; k++) {
      limit[i][j][k] = new Array(5);
      for (var q = 0; q < 5; q++) {
        limit[i][j][k][q] = 0;
      }
    }
  }
}
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 20; j++) {
    for (var k = 0; k < 5; k++) {
      limit[1][i][j][k] = 0;
    }
  }
}

// array for random idx
var random_idx_i = new Array(100);
var random_idx_j = new Array(100);
var random_idx_k = new Array(100);


// 근무 개수를 count 해주는 배열 
var cnt = new Array(100);
for (var i = 0; i < 100; i++) {
  cnt[i] = new Array();
}

// test for night work -> not duplicate
var yagan = new Array(7);
for (var i = 0; i < 7; i++) {
  yagan[i] = new Array(20);
  for (var j = 0; j < 20; j++) {
    yagan[i][j] = new Array(5);
    for (var k = 0; k < 5; k++) {
      yagan[i][j][k] = "";
    }
  }
}
var buf_yagan = new Array(7);
for (var i = 0; i < 7; i++) {
  buf_yagan[i] = new Array(20);
  for (var j = 0; j < 20; j++) {
    buf_yagan[i][j] = new Array(5);
    for (var k = 0; k < 5; k++) {
      buf_yagan[i][j][k] = "";
    }
  }
}

var human_cnt = new Array(100);     // count people for each work
var work_min = 0;
for (var i = 1; i < 100; i++) human_cnt[i] = 0;
function init() {
  cnt = new Array(100);
  for (var i = 0; i < 100; i++) {
    cnt[i] = new Array();
  }

  yagan = new Array(7);
  for (var i = 0; i < 7; i++) {
    yagan[i] = new Array(20);
    for (var j = 0; j < 20; j++) {
      yagan[i][j] = new Array(5);
      for (var k = 0; k < 5; k++) {
        yagan[i][j][k] = "";
      }
    }
  }
  random_idx_i = new Array(100);
  random_idx_j = new Array(100);
  random_idx_k = new Array(100);
  work_min = 0;
  human_cnt = new Array(100);
  for (var i = 1; i < 100; i++) human_cnt[i] = 0;
}

function start_program(e) {
  e.preventDefault();
  init();
  submitInput();
  var idxTot = Arr.length;
  console.log("실행됨 ㅎ");
  cnt = new Array(100);
  for (var i = 0; i < 100; i++) {
    cnt[i] = new Array();
  }
  human_cnt[0] = idxTot;     // human_cnt array initialize
  for (var i = 0; i < idxTot; i++) {
    cnt[0].push(Arr[i]);
  }
  processFixedNightWorkers();
  for (var i = 0; i < 7; i++) {
    //buf_yagan[i] = new Array(20);
    for (var j = 0; j < 20; j++) {
      //buf_yagan[i][j] = new Array(5);
      for (var k = 0; k < 5; k++) {
        yagan[i][j][k] = buf_yagan[i][j][k];
        //console.log(buf_yagan[i][j][k]);
      }
    }
  }

  // <!-- night work select section -->
  for (var i = 8; i <= 13; i++) {
    updateResult();
    for (var k = 0; k < 7; k++) {
      updateResult();
      if (k == 6 && i == 12) continue;
      for (var j = 0; j < 5; j++) {
        updateResult();
        if (i < 13 && j > 1) continue;
        if (yagan[k][i][j]) continue;
        var del_idx;
        var add_flag = 0;
        while (!yagan[k][i][j]) { // choose randome worker
          var random_num = Math.floor(Math.random() * 100);
          del_idx = random_num % human_cnt[work_min];
          var worker = cnt[work_min][del_idx];
          var posArr = [];
          var imposArr = [];
          // how to solve duplication problem?   --> call function for test......
          var dup_flag = 0;
          for (var ii = 8; ii <= 13; ii++) {
            for (var jj = 0; jj < 5; jj++) {
              if (yagan[k][ii][jj] == worker) {
                dup_flag = 1;
              }
            }
          }
          var worker_idx = soldier_id.findIndex(a => a === worker);
          // if chosen worker satisfy such condition -> escape while loop
          if (dup_flag == 0 && limit[worker_idx][k][i][j] == 0) {
            add_flag = 1;
            var tflag = CheckSameTime(k, i, j, worker);
            if (tflag)
              posArr.push(k * 1000 + i * 10 + j);
            else
              imposArr.push(k * 1000 + i * 10 + j);
          }

          var select_flag = 0;
          var tmp_k, tmp_i, tmp_j;
          make_random_idx(8, 13, 1); // make random index of i to select random time table
          make_random_idx(0, 4, 2);
          for (var a = 8; a <= 13; a++) {
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var b = 0; b < 5; b++) {
                var iii = random_idx_i[a];
                var jjj = random_idx_j[b];
                if (kkk == 6 && iii == 12) continue;
                //iii = a;
                //jjj = b;
                if (iii < 13 && jjj > 1) continue;
                if (yagan[kkk][iii][jjj]) continue; // already chosen that time table
                // how to solve duplication problem?   --> call function for test......
                var dup_flag = 0;
                for (var ii = 8; ii <= 13; ii++) {
                  for (var jj = 0; jj < 5; jj++) {
                    if (yagan[kkk][ii][jj] == worker) {
                      dup_flag = 1;
                    }
                  }
                }
                if (dup_flag == 0 && limit[worker_idx][kkk][iii][jjj] == 0) {
                  select_flag = 1;
                  tmp_k = kkk; tmp_j = jjj; tmp_i = iii;
                  var tflag = CheckSameTime(kkk, iii, jjj, worker);
                  if (tflag)
                    posArr.push(kkk * 1000 + iii * 10 + jjj);
                  else
                    imposArr.push(kkk * 1000 + iii * 10 + jjj);
                }
              }
            }
          }
          // if this worker is put another time table ?
          if (posArr.length) {
            var ans = posArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            updateResult();
          }
          else if (imposArr.length) {
            var ans = imposArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            console.log("안된경우 1");
            updateResult();
          }
          else {
            var finished_flag = 0;
            make_random_idx(8, 13, 1); // make random index of i to select random time table
            make_random_idx(0, 4, 2);
            var posArr_from = [];
            var posArr_to = [];
            var imposArr_from = [];
            var imposArr_to = [];
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var z = 8; z <= 13; z++) {
                for (var x = 0; x < 5; x++) {
                  var iii = random_idx_i[z];
                  var jjj = random_idx_j[x];
                  if (iii < 13 && jjj > 1) continue;
                  if (kkk == 6 && iii == 12) continue;
                  if (!yagan[kkk][iii][jjj] || buf_yagan[kkk][iii][jjj] || limit[worker_idx][kkk][iii][jjj]) continue;
                  var dup_flag = 0;
                  for (var ii = 8; ii <= 13; ii++) {
                    for (var jj = 0; jj < 5; jj++) {
                      if (yagan[kkk][ii][jj] == worker) {
                        dup_flag = 1;
                      }
                    }
                  }
                  if (dup_flag) continue;
                  // find such swap thing
                  var selected_flag = 0;
                  var to_k, to_i, to_j;
                  for (var a = 0; a < 7; a++) {
                    for (var o = 13; o >= 8; o--) {
                      for (var p = 4; p >= 0; p--) {
                        var b = random_idx_i[o];
                        var c = random_idx_j[p];
                        if (b < 13 && c > 1) continue;
                        if (a == 6 && b == 12) continue;
                        var to_worker_idx = soldier_id.findIndex(a => a === yagan[kkk][iii][jjj]);
                        if (yagan[a][b][c] || buf_yagan[a][b][c] || limit[to_worker_idx][a][b][c]) continue;
                        var to_dup_flag = 0;
                        for (var ii = 8; ii <= 13; ii++) {
                          for (var jj = 0; jj < 5; jj++) {
                            if (yagan[a][ii][jj] == yagan[kkk][iii][jjj]) {
                              to_dup_flag = 1;
                            }
                          }
                        }

                        if (to_dup_flag || limit[to_worker_idx][a][b][c]) continue;
                        selected_flag = 1;
                        to_k = a; to_j = c; to_i = b;
                        var from_tflag = CheckSameTime(kkk, iii, jjj, worker);
                        var to_tflag = CheckSameTime(a, b, c, yagan[kkk][iii][jjj]);
                        if (from_tflag && to_tflag) {
                          posArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          posArr_to.push(a * 1000 + b * 10 + c);
                        }
                        else {
                          imposArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          imposArr_to.push(a * 1000 + b * 10 + c);
                        }
                      }
                    }
                  }
                }
              }
              updateResult();
            }
            if (posArr_to.length) {
              var ans = posArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;
              ans = posArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;
              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              updateResult();
            }
            else if (imposArr_to.length) {
              var ans = imposArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;
              ans = imposArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;
              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              updateResult();
              console.log("안된경우 2");
            }
            var worker = cnt[work_min].splice(del_idx, 1);
            worker = worker[0];
            cnt[work_min + 1].push(worker);
            human_cnt[work_min]--;
            human_cnt[work_min + 1]++;
            if (human_cnt[work_min] == 0) {
              work_min++;
            }
            updateResult();
          }
        }
      }
    }
  }
  swapNightWorks();
  // <!-- night work select end -->
  processFixedDayWorkers();

  // <!-- day work select section -->

  for (var i = 1; i <= 7; i++) {
    updateResult();
    for (var k = 0; k < 7; k++) {
      updateResult();
      for (var j = 0; j < 2; j++) {
        updateResult();
        if (yagan[k][i][j]) continue;
        var del_idx;
        var add_flag = 0;
        while (!yagan[k][i][j]) { // choose randome worker
          var random_num = Math.floor(Math.random() * 100);
          del_idx = random_num % human_cnt[work_min];
          var worker = cnt[work_min][del_idx];
          var posArr = [];
          var imposArr = [];
          // how to solve duplication problem?   --> call function for test......
          var worker_idx = soldier_id.findIndex(a => a === worker);
          var dup_flag = 0;
          for (var ii = 1; ii <= 7; ii++) {
            for (var jj = 0; jj < 2; jj++) {
              if (yagan[k][ii][jj] == worker) {
                dup_flag = 1;
              }
            }
          }
          var con_flag = check_day(k, i, worker);
          if (dup_flag == 0 && con_flag && limit[worker_idx][k][i][j] == 0) {
            add_flag = 1;
            var tflag = CheckSameTime(k, i, j, worker);
            if (tflag)
              posArr.push(k * 1000 + i * 10 + j);
            else
              imposArr.push(k * 1000 + i * 10 + j);
          }

          var select_flag = 0;
          var tmp_k, tmp_i, tmp_j;

          make_random_idx(1, 7, 1);
          make_random_idx(0, 1, 2);

          for (var a = 1; a <= 7; a++) {
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var b = 0; b < 2; b++) {
                var iii = random_idx_i[a];
                var jjj = random_idx_j[b];
                //iii = a;
                //jjj = b;
                if (yagan[kkk][iii][jjj]) continue; // already chosen that time table
                // how to solve duplication problem?   --> call function for test......
                var dup_flag = 0;
                for (var ii = 1; ii <= 7; ii++) {
                  for (var jj = 0; jj < 2; jj++) {
                    if (yagan[kkk][ii][jj] == worker) {
                      dup_flag = 1;
                    }
                  }
                }
                var con_flag = check_day(kkk, iii, worker);
                if (dup_flag == 0 && con_flag && limit[worker_idx][kkk][iii][jjj] == 0) {
                  select_flag = 1;
                  tmp_k = kkk; tmp_j = jjj; tmp_i = iii;
                  var tflag = CheckSameTime(kkk, iii, jjj, worker);
                  if (tflag)
                    posArr.push(kkk * 1000 + iii * 10 + jjj);
                  else
                    imposArr.push(kkk * 1000 + iii * 10 + jjj);
                }
              }
            }
          }
          // if this worker is put another time table ?
          if (posArr.length) {
            var ans = posArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            updateResult();
          }
          else if (imposArr.length) {
            var ans = imposArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            console.log("안된경우 3");
            updateResult();
          }
          else {
            var finished_flag = 0;
            make_random_idx(1, 7, 1);
            make_random_idx(0, 1, 2);
            var posArr_from = [];
            var posArr_to = [];
            var imposArr_from = [];
            var imposArr_to = [];
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var z = 1; z <= 7; z++) {
                for (var x = 0; x < 2; x++) {
                  var iii = random_idx_i[z];
                  var jjj = random_idx_j[x];
                  if (!yagan[kkk][iii][jjj] || buf_yagan[kkk][iii][jjj] || limit[worker_idx][kkk][iii][jjj]) continue;
                  var dup_flag = 0;
                  for (var ii = 1; ii <= 7; ii++) {
                    for (var jj = 0; jj < 2; jj++) {
                      if (yagan[kkk][ii][jj] == worker) {
                        dup_flag = 1;
                      }
                    }
                  }
                  var con_flag = check_day(kkk, iii, worker);
                  if (dup_flag || !con_flag) continue;
                  // find such swap thing
                  var selected_flag = 0;
                  var to_k, to_i, to_j;
                  for (var a = 0; a < 7; a++) {
                    for (var o = 7; o >= 1; o--) {
                      for (var p = 1; p >= 0; p--) {
                        var b = random_idx_i[o];
                        var c = random_idx_j[p];
                        var to_worker_idx = soldier_id.findIndex(a => a === yagan[kkk][iii][jjj]);
                        if (yagan[a][b][c] || buf_yagan[a][b][c] || limit[to_worker_idx][a][b][c]) continue;
                        var to_dup_flag = 0;
                        for (var ii = 1; ii <= 7; ii++) {
                          for (var jj = 0; jj < 2; jj++) {
                            if (yagan[a][ii][jj] == yagan[kkk][iii][jjj]) {
                              to_dup_flag = 1;
                            }
                          }
                        }
                        var to_con_flag = check_day(a, b, yagan[kkk][iii][jjj]);
                        if (to_dup_flag || !to_con_flag || limit[to_worker_idx][a][b][c]) continue;
                        selected_flag = 1;
                        to_k = a; to_j = c; to_i = b;

                        var from_tflag = CheckSameTime(kkk, iii, jjj, worker);
                        var to_tflag = CheckSameTime(a, b, c, yagan[kkk][iii][jjj]);
                        if (from_tflag && to_tflag) {
                          posArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          posArr_to.push(a * 1000 + b * 10 + c);
                        }
                        else {
                          imposArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          imposArr_to.push(a * 1000 + b * 10 + c);
                        }

                      }
                    }
                  }
                }
              }
              updateResult();
            }
            if (posArr_to.length) {
              var ans = posArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;

              ans = posArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;
              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              updateResult();
            }
            else if (imposArr_to.length) {
              var ans = imposArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;

              ans = imposArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;

              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              console.log("안된경우 4");
              updateResult();
            }
            var worker = cnt[work_min].splice(del_idx, 1);
            worker = worker[0];
            cnt[work_min + 1].push(worker);
            human_cnt[work_min]--;
            human_cnt[work_min + 1]++;
            if (human_cnt[work_min] == 0) {
              work_min++;
            }
            updateResult();
          }
        }
      }
    }
  }
  updateResult();
  lastCheck();

  updateResult();
  printWork();
  updateResult();
  // cntResult();
  updateResult();
  printCheckResult();
  console.log(yagan);
}
function dayWork() {
  var idxTot = Arr.length;
  work_min = 0;
  human_cnt = new Array(100);
  for (var i = 1; i < 100; i++) human_cnt[i] = 0;
  cnt = new Array(100);
  for (var i = 0; i < 100; i++) {
    cnt[i] = new Array();
  }
  human_cnt[0] = idxTot;     // human_cnt array initialize
  for (var i = 0; i < idxTot; i++) {
    cnt[0].push(Arr[i]);
  }
  printWork();
  //  <!-- day work select section -->

  for (var i = 1; i <= 7; i++) {
    updateResult();
    for (var k = 0; k < 7; k++) {
      updateResult();
      for (var j = 0; j < 2; j++) {
        updateResult();
        if (yagan[k][i][j]) continue;
        var del_idx;
        var add_flag = 0;
        while (!yagan[k][i][j]) { // choose randome worker
          var random_num = Math.floor(Math.random() * 100);
          del_idx = random_num % human_cnt[work_min];
          var worker = cnt[work_min][del_idx];
          var posArr = [];
          var imposArr = [];
          // how to solve duplication problem?   --> call function for test......
          var worker_idx = soldier_id.findIndex(a => a === worker);
          var dup_flag = 0;
          for (var ii = 1; ii <= 7; ii++) {
            for (var jj = 0; jj < 2; jj++) {
              if (yagan[k][ii][jj] == worker) {
                dup_flag = 1;
              }
            }
          }
          var con_flag = check_day(k, i, worker);
          if (dup_flag == 0 && con_flag && limit[worker_idx][k][i][j] == 0) {
            add_flag = 1;
            printWork();
            var tflag = CheckSameTime(k, i, j, worker);
            if (tflag)
              posArr.push(k * 1000 + i * 10 + j);
            else
              imposArr.push(k * 1000 + i * 10 + j);
          }

          var select_flag = 0;
          var tmp_k, tmp_i, tmp_j;

          make_random_idx(1, 7, 1);
          make_random_idx(0, 1, 2);

          for (var a = 1; a <= 7; a++) {
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var b = 0; b < 2; b++) {
                var iii = random_idx_i[a];
                var jjj = random_idx_j[b];
                //iii = a;
                //jjj = b;
                if (yagan[kkk][iii][jjj]) continue; // already chosen that time table
                // how to solve duplication problem?   --> call function for test......
                var dup_flag = 0;
                for (var ii = 1; ii <= 7; ii++) {
                  for (var jj = 0; jj < 2; jj++) {
                    if (yagan[kkk][ii][jj] == worker) {
                      dup_flag = 1;
                    }
                  }
                }
                var con_flag = check_day(kkk, iii, worker);
                if (dup_flag == 0 && con_flag && limit[worker_idx][kkk][iii][jjj] == 0) {
                  select_flag = 1;
                  tmp_k = kkk; tmp_j = jjj; tmp_i = iii;
                  var tflag = CheckSameTime(kkk, iii, jjj, worker);
                  if (tflag)
                    posArr.push(kkk * 1000 + iii * 10 + jjj);
                  else
                    imposArr.push(kkk * 1000 + iii * 10 + jjj);
                }
              }
            }
          }
          // if this worker is put another time table ?
          if (posArr.length) {
            var ans = posArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            updateResult();
          }
          else if (imposArr.length) {
            var ans = imposArr[0];
            var jPos = ans % 10;
            ans = Math.floor(ans / 10);
            var iPos = ans % 100;
            ans = Math.floor(ans / 100);
            var kPos = ans;
            add_work(del_idx, kPos, iPos, jPos);
            for (var q = 0; q <= 5; q++) {
              yagan[q + 1][0][0] = yagan[q][12][0];
              yagan[q + 1][0][1] = yagan[q][12][1];
            }
            console.log("안된경우 3");
            updateResult();
          }
          else {
            var finished_flag = 0;
            make_random_idx(1, 7, 1);
            make_random_idx(0, 1, 2);
            var posArr_from = [];
            var posArr_to = [];
            var imposArr_from = [];
            var imposArr_to = [];
            for (var kkk = 0; kkk < 7; kkk++) {
              for (var z = 1; z <= 7; z++) {
                for (var x = 0; x < 2; x++) {
                  var iii = random_idx_i[z];
                  var jjj = random_idx_j[x];
                  if (!yagan[kkk][iii][jjj] || buf_yagan[kkk][iii][jjj] || limit[worker_idx][kkk][iii][jjj]) continue;
                  var dup_flag = 0;
                  for (var ii = 1; ii <= 7; ii++) {
                    for (var jj = 0; jj < 2; jj++) {
                      if (yagan[kkk][ii][jj] == worker) {
                        dup_flag = 1;
                      }
                    }
                  }
                  var con_flag = check_day(kkk, iii, worker);
                  if (dup_flag || !con_flag) continue;
                  // find such swap thing
                  var selected_flag = 0;
                  var to_k, to_i, to_j;
                  for (var a = 0; a < 7; a++) {
                    for (var o = 7; o >= 1; o--) {
                      for (var p = 1; p >= 0; p--) {
                        var b = random_idx_i[o];
                        var c = random_idx_j[p];
                        var to_worker_idx = soldier_id.findIndex(a => a === yagan[kkk][iii][jjj]);
                        if (yagan[a][b][c] || buf_yagan[a][b][c] || limit[to_worker_idx][a][b][c]) continue;
                        var to_dup_flag = 0;
                        for (var ii = 1; ii <= 7; ii++) {
                          for (var jj = 0; jj < 2; jj++) {
                            if (yagan[a][ii][jj] == yagan[kkk][iii][jjj]) {
                              to_dup_flag = 1;
                            }
                          }
                        }
                        var to_con_flag = check_day(a, b, yagan[kkk][iii][jjj]);
                        if (to_dup_flag || !to_con_flag || limit[to_worker_idx][a][b][c]) continue;
                        selected_flag = 1;
                        to_k = a; to_j = c; to_i = b;

                        var from_tflag = CheckSameTime(kkk, iii, jjj, worker);
                        var to_tflag = CheckSameTime(a, b, c, yagan[kkk][iii][jjj]);
                        if (from_tflag && to_tflag) {
                          posArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          posArr_to.push(a * 1000 + b * 10 + c);
                        }
                        else {
                          imposArr_from.push(kkk * 1000 + iii * 10 + jjj);
                          imposArr_to.push(a * 1000 + b * 10 + c);
                        }

                      }
                    }
                  }
                }
              }
              updateResult();
            }
            if (posArr_to.length) {
              var ans = posArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;

              ans = posArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;
              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              updateResult();
            }
            else if (imposArr_to.length) {
              var ans = imposArr_from[0];
              var jPos = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos = ans;

              ans = imposArr_to[0];
              var jPos_to = ans % 10;
              ans = Math.floor(ans / 10);
              var iPos_to = ans % 100;
              ans = Math.floor(ans / 100);
              var kPos_to = ans;

              yagan[kPos_to][iPos_to][jPos_to] = yagan[kPos][iPos][jPos];
              yagan[kPos][iPos][jPos] = worker;

              for (var q = 0; q <= 5; q++) {
                yagan[q + 1][0][0] = yagan[q][12][0];
                yagan[q + 1][0][1] = yagan[q][12][1];
              }
              console.log("안된경우 4");
              updateResult();
            }
            var worker = cnt[work_min].splice(del_idx, 1);
            worker = worker[0];
            cnt[work_min + 1].push(worker);
            human_cnt[work_min]--;
            human_cnt[work_min + 1]++;
            if (human_cnt[work_min] == 0) {
              work_min++;
            }
            updateResult();
          }
        }
      }
    }
  }
  updateResult();
  lastCheck();

  updateResult();
  printWork();
  updateResult();
  //cntResult();
  updateResult();
  printCheckResult();
} function CheckSameTime(kk, ii, jj, name) {
  var flag = 1;
  //if (name == "") return 0;
  // 불침번이랑 CCTV 나누어야 하지 않을까요?
  // 불침번 case
  if (ii == 13) {
    for (var k = 0; k < 7; k++) {
      if (k == kk) continue;
      if (!yagan[k][ii][jj]) continue;
      if (yagan[k][ii][jj] === name) {
        flag = 0;
        break;
      }
    }
  }
  else {
    for (var k = 0; k < 7; k++) {
      for (var j = 0; j < 2; j++) {
        if (k == kk) continue;
        if (!yagan[k][ii][j]) continue;
        if (yagan[k][ii][j] === name) {
          flag = 0;
          break;
        }
      }
    }
  }
  return flag;
}
function printWork() {
  // <!-- print about work list for 7 days -->
  var st = 6;
  var en = 8;
  for (var k = 0; k < 7; k++) {
    console.log("Day", k + 1);
    for (var i = 0; i <= 13; i++) {
      // 불침번 print
      if (i == 13) {
        console.log(i, "불침번 : ", yagan[k][i][0], yagan[k][i][1], yagan[k][i][2], yagan[k][i][3], yagan[k][i][4])
        continue;
      }
      else if (i == 12) continue;
      else {
        console.log(i, st, en, yagan[k][i][0], yagan[k][i][1]);
      }

      st += 2; en += 2;
      if (st == 24) st = 0;
      if (en == 24) en = 0;
    }
  }
}

// function for add worker to time table
function add_work(del_idx, k, i, j) {
  var worker = cnt[work_min].splice(del_idx, 1);
  worker = worker[0];
  cnt[work_min + 1].push(worker);

  human_cnt[work_min]--;
  human_cnt[work_min + 1]++;
  if (human_cnt[work_min] == 0) {
    work_min++;
  }
  yagan[k][i][j] = worker;
  console.log("추가중");
}
// function for check work consecutively
function check_day(day, idx, name) {
  var possible = 1;
  // consider the situation that works consequtively -> day-night or night-day
  if (idx == 1) {
    if (name == yagan[day][idx - 1][0] || name == yagan[day][idx - 1][1]) possible = 0;
    if (name == yagan[day][idx + 1][0] || name == yagan[day][idx + 1][1]) possible = 0;
  }
  else if (idx == 7) {
    if (name == yagan[day][idx - 1][0] || name == yagan[day][idx - 1][1]) possible = 0;
    if (name == yagan[day][idx + 1][0] || name == yagan[day][idx + 1][1]) possible = 0;
    if (name == yagan[day][13][0]) possible = 0;
  }
  else {
    if (name == yagan[day][idx + 1][0] || name == yagan[day][idx + 1][1]) possible = 0;
    if (name == yagan[day][idx - 1][0] || name == yagan[day][idx - 1][1]) possible = 0;
  }
  // 퐁당 방지를 해줘야 될까 ???
  // 06~08, 10~12 퐁당..?
  if (idx == 2) {
    if (name == yagan[day][0][1] || name == yagan[day][0][0]) possible = 0;
  }
  // 불말, 04~06, 08~10 퐁당..?
  if (idx == 1 && day) {
    if (name == yagan[day - 1][13][4]) possible = 0;
    if (name == yagan[day - 1][12][0] || name == yagan[day - 1][12][1]) possible = 0;
  }
  // 18~20, 22~00, 불초 퐁당..?
  if (idx == 6) {
    if (name == yagan[day][8][0] || name == yagan[day][8][1]) possible = 0;
    if (name == yagan[day][13][0]) possible = 0;
  }
  // 20~22  00~02 퐁당..?
  if (idx == 7) {
    if (name == yagan[day][9][0] || name == yagan[day][9][1]) possible = 0;
  }
  return possible;
}
// make random index  flag=1 i, flag=2 j, flag=3 k!
function make_random_idx(st, en, flag) {
  var gap = en - st + 1;
  var buf = new Array(gap);
  var visited = new Array(100);
  for (var i = 0; i < 100; i++) visited[i] = 0;
  var chk_cnt = 0;
  while (chk_cnt < gap) {
    while (true) {
      var rand_idx = Math.floor(Math.random() * (gap)) + st;
      if (visited[rand_idx]) continue;
      visited[rand_idx] = 1;
      buf[chk_cnt++] = rand_idx;
      break;
    }
  }
  if (flag == 1) {
    //random_idx_i
    for (var i = 0; i < gap; i++) {
      random_idx_i[i + st] = buf[i];
    }
  }
  if (flag == 2) {
    //random_idx_j
    for (var j = 0; j < gap; j++) {
      random_idx_j[j + st] = buf[j];
    }
  }
  if (flag == 3) {
    //random_idx_k
    for (var i = 0; i < gap; i++) {
      random_idx_i[i + st] = buf[i];
    }
  }
}
// function for input button
function click_button() {
  if (!document.getElementById("input_name").value) {
    console.log("안돼야됨");
    return 0;
  }
  // save input worker's name
  var worker_name = document.getElementById("input_name").value;
  // push worker's information to initial array
  var str = worker_name;
  Arr.push(str);
  soldier_id[cur_index] = str;
  printHQstr(str);

  // save input worker's limitation of work time
  var limit_value_arr = new Array();
  const soldier_limit = document.getElementsByName("time_lim");
  for (var i = 0; i < soldier_limit.length; i++) {
    if (soldier_limit[i].checked == true) limit_value_arr.push(soldier_limit[i].value);
  }
  for (var i = 0; i < limit_value_arr.length; i++) {
    var num = parseInt(limit_value_arr[i]);
    console.log(num);
    // cctv worker
    if (num < 84) {
      var a = num % 7;
      var b = parseInt(num / 7);
      limit[cur_index][num % 7][parseInt(num / 7)][0] = 1;
      limit[cur_index][num % 7][parseInt(num / 7)][1] = 1;
      if (b == 0 && a >= 1) {
        limit[cur_index][a - 1][12][0] = 1;
        limit[cur_index][a - 1][12][1] = 1;
      }
    }
    // 불침번
    else {
      var a = num % 7;
      var b = parseInt(num / 7) - 12;
      limit[cur_index][a][13][b] = 1;
    }
  }
  cur_index++;
  input_name.value = "";
  resetButton(-1, 3);
}

function checkButton(n, flag) {
  var boxes = document.getElementsByName("time_lim");
  if (flag == 1) {
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].value % 7 == n) boxes[i].checked = true;
    }
  }
  else if (flag == 2) {
    for (var i = 0; i < boxes.length; i++) {
      if (Math.floor(boxes[i].value / 7) == n) boxes[i].checked = true;
    }
  }
  else if (flag == 3) {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = true;
    }
  }
  console.log("누름")
  handleLimit();
}
function resetButton(n, flag) {
  var boxes = document.getElementsByName("time_lim");
  if (flag == 1) {
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].value % 7 == n) boxes[i].checked = false;
    }
  }
  else if (flag == 2) {
    for (var i = 0; i < boxes.length; i++) {
      if (Math.floor(boxes[i].value / 7) == n) boxes[i].checked = false;
    }
  }
  else if (flag == 3) {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = false;
    }
  }
  handleLimit();
} function enterKey() {
  if (window.event.keyCode == 13) {
    if (input_name.value) click_button();
  }
} function fixed_submit_button() {
  var day = document.getElementById("fixed_day");
  var time = document.getElementById("fixed_time");
  if (time.selectedIndex <= 11) {
    var pos = document.getElementById("work_type");
    buf_yagan[day.selectedIndex][time.selectedIndex][pos.selectedIndex] = document.getElementById("fixed_name").value;
    yagan[day.selectedIndex][time.selectedIndex][pos.selectedIndex] = document.getElementById("fixed_name").value;
    if (time.selectedIndex == 0 && day.selectedIndex >= 1) {
      buf_yagan[day.selectedIndex - 1][12][pos.selectedIndex] = document.getElementById("fixed_name").value;
    }
  }
  updateResult();
  cntResult();
}
function fixed_submit_button2() {
  var day = document.getElementById("fixed_day2");
  var pos = document.getElementById("bool_type");
  buf_yagan[day.selectedIndex][13][pos.selectedIndex] = document.getElementById("fixed_name2").value;
  yagan[day.selectedIndex][13][pos.selectedIndex] = document.getElementById("fixed_name2").value;
  updateResult();
  cntResult();
}
function processFixedNightWorkers() {
  for (var i = 0; i < Arr.length; i++) {
    var cur_worker = Arr[i];
    var cntWork = 0;
    for (var a = 0; a < 7; a++) {
      for (var b = 0; b <= 13; b++) {
        if (b == 12 || (1 <= b && b <= 7)) continue;
        for (var c = 0; c < 5; c++) {
          if (buf_yagan[a][b][c] == cur_worker) cntWork++;
        }
      }
    }
    var worker_idx = cnt[0].findIndex(n => n === cur_worker);
    var tmp = cnt[0].splice(worker_idx, 1);
    cnt[cntWork].push(cur_worker);
    human_cnt[0]--;
    human_cnt[cntWork]++;
  }
  for (var i = 0; i < 100; i++) {
    if (human_cnt[i]) {
      work_min = i;
      break;
    }
  }
} function processFixedDayWorkers() {
  for (var i = 0; i < Arr.length; i++) {
    var cur_worker = Arr[i];
    var cntWork = 0;
    for (var a = 0; a < 7; a++) {
      for (var b = 1; b <= 7; b++) {
        for (var c = 0; c < 5; c++) {
          if (buf_yagan[a][b][c] == cur_worker) cntWork++;
        }
      }
    }
    var min_idx, worker_idx;
    for (var j = 0; j < 100; j++) {
      var tmp = cnt[j].findIndex(n => n === cur_worker);
      if (tmp == -1) continue;
      min_idx = j;
      worker_idx = tmp;
      break;
    }
    var tmp = cnt[min_idx].splice(worker_idx, 1);
    cnt[cntWork + min_idx].push(cur_worker);
    human_cnt[min_idx]--;
    human_cnt[cntWork + min_idx]++;
  }
  for (var i = 0; i < 100; i++) {
    if (human_cnt[i]) {
      work_min = i;
      break;
    }
  }
}
 function updateResult() {
  for (var k = 0; k < 7; k++) {
    for (var i = 0; i <= 13; i++) {
      if (i == 12) continue;
      for (j = 0; j < 5; j++) {
        if (i < 13 && j > 1) continue;
        var val = k * 1000 + i * 10 + j;
        var str_data = "data" + String(val);
        document.getElementById(str_data).innerText = yagan[k][i][j];
      }
    }
  }
} function setDay(e) {
  e.preventDefault();
  var tmp = document.getElementById("today").value;
  if(tmp.length === 0){
    alert("날짜를 입력 후 버튼을 눌러주세요")
    return;
  }
  var year = tmp[0] + tmp[1] + tmp[2] + tmp[3];
  var month = tmp[5] + tmp[6];
  var day = tmp[8] + tmp[9];
  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  var days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // 윤년 check
  if (((year % 100 != 0) && (year % 4 == 0)) || year % 400 == 0) days[2]++;
  var week = ["월", "화", "수", "목", "금", "토", "일"];
  for (var i = 0; i < 7; i++) {
    // update
    var update_id1 = "day" + String(i + 1) + "1";
    var update_id2 = "day" + String(i + 1) + "2";
    var update_id3 = "day" + String(i + 1) + "3";
    var update_id4 = "day" + String(i + 1) + "4";
    var update_str = String(month) + "/" + String(day) + " " + week[i];
    console.log(update_id1, update_id2, update_str);
    document.getElementById(update_id1).innerText = update_str;
    document.getElementById(update_id2).innerText = update_str;
    document.getElementById(update_id3).innerText = update_str;
    document.getElementById(update_id4).innerText = update_str;
    day++;
    if (day > days[month]) {
      day -= days[month];
      month++;
      if (month == 13) month = 1;
    }

  }
}
function deleteWorker() {
  // Arr : last element delete, decrease cur_idx and reset that limit array.
  if (cur_index <= 0) return;
  Arr.pop();
  soldier_id[cur_index] = "";
  cur_index--;
  var tmp = Arr.splice(cur_index, 1);
  // reset limitation array for worker
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j <= 13; j++) {
      for (var k = 0; k < 5; k++) {
        limit[cur_index][i][j][k] = 0;
      }
    }
  }
  printHQstr();
} var visited = new Array(7);
for (var i = 0; i < 7; i++) {
  visited[i] = new Array(20);
  for (var j = 0; j < 20; j++) {
    visited[i][j] = new Array(5);
    for (var k = 0; k < 5; k++) {
      visited[i][j][k] = 0;
    }
  }
}
function lastCheck() {
  var flag = 1000;
  var impos_flag = 0;
  while (!impos_flag) {
    impos_flag = 1;
    // 전체적으로 균등한 지 확인
    var select_i, select_j, select_k;
    for (var k = 0; k < 7; k++) {
      for (var i = 1; i <= 7; i++) {
        for (var j = 0; j < 5; j++) {
          if (i < 13 && j > 2) continue;
          if (buf_yagan[k][i][j]) continue;
          var chk = line_check(k, i, j);
          if (!chk && !visited[k][i][j]) {
            impos_flag = 0;
            select_i = i; select_j = j; select_k = k;
            visited[k][i][j] = 1;
            break;
          }
        }
        if (!impos_flag) break;
      }
      if (!impos_flag) break;
    }
    if (impos_flag) break;  // already perfect state;
    // selected
    // 선택된게 주간인 경우는 ? j == 1 ~ 7
    if (select_i >= 1 && select_i <= 7) {
      for (var i = 1; i <= 7; i++) {
        if (i == select_i) continue;
        if (buf_yagan[select_k][i][select_j]) continue;
        var a_worker_idx = soldier_id.findIndex(a => a === yagan[select_k][i][select_j]);
        var b_worker_idx = soldier_id.findIndex(a => a === yagan[select_k][select_i][select_j]);
        if (limit[a_worker_idx][select_k][select_i][select_j] || limit[b_worker_idx][select_k][i][select_j]) continue;
        var a_flag = 1, b_flag = 1;
        //console.log(yagan[select_k][i][select_j], yagan[select_k][select_i][select_j])
        [yagan[select_k][select_i][select_j], yagan[select_k][i][select_j]] = [yagan[select_k][i][select_j], yagan[select_k][select_i][select_j]];
        var c1_flag = check_day(select_k, select_i, yagan[select_k][select_i][select_j]);
        var c2_flag = check_day(select_k, i, yagan[select_k][i][select_j]);
        a_flag = line_check(select_k, select_i, select_j);
        b_flag = line_check(select_k, i, select_j);
        //console.log(yagan[select_k][select_i][select_j], yagan[select_k][i][select_j])
        console.log(c1_flag, c2_flag, a_flag, b_flag, select_k, select_i, select_j, i);
        if (!c1_flag || !c2_flag || !a_flag || !b_flag) {
          [yagan[select_k][select_i][select_j], yagan[select_k][i][select_j]] = [yagan[select_k][i][select_j], yagan[select_k][select_i][select_j]];
          continue;
        }
        for (var a = 0; a < 7; a++) {
          for (var b = 0; b <= 13; b++) {
            for (var c = 0; c < 5; c++) {
              visited[a][b][c] = 0;
            }
          }
        }
        console.log("스왑되었스빈다 ㅋㅋ");
        break;
      }
    }
  }
}
function line_check(cur_k, cur_i, cur_j) {
  var flag = 1;
  for (var k = 0; k < 7; k++) {
    if (k == cur_k) continue;
    // 불침번인 경우
    if (cur_i == 13) {
      if (yagan[k][cur_i][cur_j] == yagan[cur_k][cur_i][cur_j]) {
        flag = 0;
        break;
      }
    }
    // cctv case
    else {
      for (var j = 0; j < 2; j++) {
        if (yagan[k][cur_i][j] == yagan[cur_k][cur_i][cur_j]) {
          flag = 0;
          break;
        }
      }
    }
    if (!flag) break;
  }
  return flag;
} function cntResult() {
  var count_str = "";
  for (var q = 1; q < cur_index; q++) {
    var worker_name = soldier_id[q];
    var night_cnt = 0; var day_cnt = 0;
    if (yagan[0][0][1] == worker_name) night_cnt++;
    if (yagan[0][0][0] == worker_name) night_cnt++;
    for (var k = 0; k < 7; k++) {
      for (var i = 8; i <= 13; i++) {
        for (var j = 0; j < 5; j++) {
          if (yagan[k][i][j] == worker_name) night_cnt++;
        }
      }
    }
    for (var k = 0; k < 7; k++) {
      for (var i = 1; i <= 7; i++) {
        for (var j = 0; j < 2; j++) {
          if (yagan[k][i][j] == worker_name) day_cnt++;
        }
      }
    }
    count_str += worker_name + " : " + String(night_cnt) + " / " + String(day_cnt) + " / " + String(night_cnt + day_cnt);
    count_str += "\n";
  }
  document.getElementById("result").innerText = count_str;
} function submitInput() {
  var name_list = Arr;
  cur_index = 1;
  for (var i = 0; i < name_list.length; i++) {
    soldier_id[cur_index] = name_list[i];
    cur_index++;
  }
}
 function handleSelectClick() {
  submitInput();
  makeSelect();
}
function handleLimit() {
  if(document.querySelector('input[name="workerList"]:checked') === null) return;
  var name = document.querySelector('input[name="workerList"]:checked').value;
  console.log(name);
  let val = -1;
  for(let i = 0 ; i < Arr.length; i++){
    if(name === Arr[i]){
      val =i + 1;
      break;
    }
  }
  console.log(val);
  val = parseInt(val);
  // save input worker's limitation of work time

  var limit_value_arr = new Array();
  const soldier_limit = document.getElementsByName("time_lim");
  for (var i = 0; i < soldier_limit.length; i++) {
    if (soldier_limit[i].checked == true) limit_value_arr.push(soldier_limit[i].value);
  }
  for (let k = 0; k < 7; k++) {
    for (let i = 0; i <= 13; i++) {
      for (let j = 0; j < 5; j++) {
        limit[val][k][i][j] = 0;
      }
    }
  }
  for (var i = 0; i < limit_value_arr.length; i++) {
    var num = parseInt(limit_value_arr[i]);
    // cctv worker
    if (num < 84) {
      var a = num % 7;
      var b = parseInt(num / 7);
      limit[val][num % 7][parseInt(num / 7)][0] = 1;
      limit[val][num % 7][parseInt(num / 7)][1] = 1;
      if (b == 0 && a >= 1) {
        limit[val][a - 1][12][0] = 1;
        limit[val][a - 1][12][1] = 1;
      }
    }
    // 불침번
    else {
      var a = num % 7;
      var b = parseInt(num / 7) - 12;
      limit[val][a][13][b] = 1;
    }
  }
}
function handleRadio(name) {
  let val=-1;
  for(let i = 0 ; i < Arr.length; i++){
    if(Arr[i] === name){
      console.log(123);
      val= i +1;
      break;
    }
  }
  console.log(val);
  val = parseInt(val);
  console.log(val);
  var boxes = document.getElementsByName("time_lim");
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }
  for (let k = 0; k < 7; k++) {
    for (let i = 0; i <= 13; i++) {
      for (let j = 0; j < 5; j++) {
        // if cctv worker
        let num = -1;
        let Flag = 0;
        if (i < 12 && j < 1) {
          num = i * 7 + k;
          Flag = 1;
        }
        // if 불침번
        else if (i == 13) {
          num = 84 + j * 7 + k;
          Flag = 1;
        }
        if (Flag == 0) continue;
        for (var q = 0; q < boxes.length; q++) {

          if (limit[val][k][i][j] == 1) {
            if (boxes[q].value == num) {
              boxes[q].checked = true;
            }
          }

        }

      }
    }
  }
} function resetNightWorks(flag) {
  let n1 = 56 + flag;
  let n2 = 63 + flag;
  let n3 = 70 + flag;
  let n4 = 77 + flag;
  let n5 = 84 + flag;
  let n6 = 91 + flag;
  let n7 = 98 + flag;
  let n8 = 105 + flag;
  let n9 = 112 + flag;
  var boxes = document.getElementsByName("time_lim");
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].value == n1) boxes[i].checked = false;
    if (boxes[i].value == n2) boxes[i].checked = false;
    if (boxes[i].value == n3) boxes[i].checked = false;
    if (boxes[i].value == n4) boxes[i].checked = false;
    if (boxes[i].value == n5) boxes[i].checked = false;
    if (boxes[i].value == n6) boxes[i].checked = false;
    if (boxes[i].value == n7) boxes[i].checked = false;
    if (boxes[i].value == n8) boxes[i].checked = false;
    if (boxes[i].value == n9) boxes[i].checked = false;
  }
  handleLimit();
}

function printCheckResult() {
  for (var k = 0; k < 7; k++) {
    for (var i = 0; i <= 13; i++) {
      for (var j = 0; j < 5; j++) {
        if (i < 13 && j > 1) continue;
        let flag = line_check(k, i, j);
        if (!flag) console.log(k, i, j);
      }
    }
  }
}
function swapNightWorks() {
  let swapFlag = 0;
  let cnt = 0;
  while (!swapFlag) {
    console.log("시작");
    swapFlag = 0;
    cnt++;
    if (cnt >= 100) break;
    for (let k = 0; k < 7; k++) {
      for (let i = 8; i <= 13; i++) {
        for (let j = 0; j < 5; j++) {
          if (!yagan[k][i][j]) continue;
          var worker_idx = soldier_id.findIndex(a => a === yagan[k][i][j]);
          if (buf_yagan[k][i][j]) continue;
          let lineFlag = line_check(k, i, j);
          if (lineFlag) continue;

          for (let ii = 8; ii <= 13; ii++) {
            if (ii <= 12 && ii == i) continue;
            for (let jj = 0; jj < 5; jj++) {
              if (!yagan[k][ii][jj]) continue;
              var tmp_worker_idx = soldier_id.findIndex(a => a === yagan[k][ii][jj]);
              if (buf_yagan[k][ii][jj]) continue;
              if (limit[tmp_worker_idx][k][i][j] || limit[worker_idx][k][ii][jj]) continue;

              [yagan[k][i][j], yagan[k][ii][jj]] = [yagan[k][ii][jj], yagan[k][i][j]];
              let lineFlag1 = line_check(k, i, j);
              let lineFlag2 = line_check(k, ii, jj);
              if (lineFlag1 && lineFlag2) {
                swapFlag = 1;
                for (var q = 0; q <= 5; q++) {
                  yagan[q + 1][0][0] = yagan[q][12][0];
                  yagan[q + 1][0][1] = yagan[q][12][1];
                }
                continue;
              }
              [yagan[k][i][j], yagan[k][ii][jj]] = [yagan[k][ii][jj], yagan[k][i][j]];
            }
          }
        }
      }
    }
  }
  console.log("끝");
}
      
    
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap : 10px;

  .make{
    font-size: 1.5em;
    height:2em;
    font-family:'Nanumgothic';
  }
`;

const InputTable = styled.table`
  background-color: #473c31;
  border: solid 1px white;
  width: 100%;
  font-weight: bold;
  .sat{
    color:blue;
  }
  .sun{
    color:red;
  }

  td, th{
    padding: 3px;
    border: solid 1px white;
    text-align: center;
    vertical-align: middle;
  }
  caption{
    padding : 10px;
    font-family:'Nanumgothic';
    font-size: 20px;
    margin: 1;
    border-radius: 5px;
    border: dashed 2px white;
  }
`;

const ResultTable = styled.table`
  background-color: #369136;
  border: solid 1px white;
  width: 100%;
  height: 50px;
  font-weight: bold;
  font-size: 15px;
  td, th{
    padding: 8px;
    border: solid 1px white;
    text-align: center;
    vertical-align: middle;
  }
  caption{
    padding : 10px;
    font-family:'Nanumgothic';
    font-size: 20px;
    margin: 1;
    border-radius: 5px;
    border: dashed 2px white;
  }

  td:nth-child(2n){
        background-color: #5c0d0d; 
    }

  .sat{
    color:blue;
  }
  .sun{
    color:red;
  }
  tr {
  }
`;

const InputWrapper = styled.div`
  display : flex;
  gap: 20px;
  align-items: stretch;
  
`;

const InputDate = styled.div`
  display: flex;
  input[type=date]{
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
  }
  p{
    font-size : 20px;
  }
`;

const InputList = styled.div`
  
`;

const NameWrapper = styled.div`
  border: solid 1px white;
  display:flex;
  flex-direction: column;
  input[type=radio]{
    display:none;
    
  }
  :hover{
    div{
      background-color: lightblue;
    }
  }
  
  input:checked + label{
    div{
      background-color:gray;
    }
  }
  h1{
  font-family:'Nanumgothic';
  text-align: center;

}
`;

const NameBox = styled.div`
  background: black;
  padding: 0px 0px;
  gap: 5px;
  display: flex;
  flex-direction:column;
  justify-content: center;
  
`;

const SaveResult = styled.div`
  button{
  font-size:1em;
  height:2.5em;
  font-family:'Nanumgothic';
}
`

const FixedInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  select{
    width: 200px;
    padding:5px;
    border:1px solid #999;
    font-family:'Nanumgothic';
    border-radius:3px;
    -moz-apperance: none;
    -webkit-apperance: none;
    font-size: 15px;
  }
`;

const FixedCCTV = styled.div`
  display:flex;
  align-items: stretch;

`;

const FixedBool = styled.div`
    display:flex;
    align-items: stretch;
`;

function NameTag({name, id}) {
  const [idx, setIdx] = useState();


  return <NameWrapper>
    <input type="radio" onChange={()=>handleRadio(name)}  name="workerList" id={id} value={name}></input>
    <label for={id}>
      <NameBox>
        <h1>{name}</h1>
        <h1>{id}</h1>
      </NameBox>
    </label>
  </NameWrapper>
}

export default function Project(){

  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState();
  const fecthWorkers = async () => {
    const tweetQuery = query(
      collection(db, "workers"),
    );
    const snapshot = await getDocs(tweetQuery);
    const workers = snapshot.docs.map(doc => {
      const { name } = doc.data();
      return {
        name,
        id: doc.id,
      }
    })
    setWorkers(workers);
    var Tmp = [];
    for(let i = 0 ; i < workers.length; i++){
      Tmp.push(workers[i].name);
    }
    Arr = Tmp;
  };
  useEffect(() => {
    fecthWorkers();
    console.log("실행됨");
  }, [flag]);

  console.log(workers);
  console.log("헤헤헤헤", Arr);
  for(let i = 0; i < workers.length; i++){
    console.log(workers[i].name, workers[i].id);
  }

  return <Wrapper>

        <p>시작 날짜를 입력해주세요!</p>
    <InputDate>
        <input type="date" id="today" name="today"/>
        <button value="날짜입력" id="day_select" onClick={setDay}>날짜 입력</button>
    </InputDate>
    <InputWrapper>
    <InputTable >
      <caption>근무 제한 사항</caption>
      <tbody><tr>
        <th></th>
        <th colspan="1"><p id="day11">월</p></th>
        <th colspan="1"><p id="day21">화</p></th>
        <th colspan="1"><p id="day31">수</p></th>
        <th colspan="1"><p id="day41">목</p></th>
        <th colspan="1"><p id="day51">금</p></th>
        <th class="sat" colspan="1"><p id="day61">토</p></th>
        <th class="sun" colspan="1"><p id="day71">일</p></th>
        <th colspan="1">줄 체크</th>
      </tr>
        <tr>
          <td>06:00~08:00</td>
          <td><input type="checkbox" name="time_lim" value="0" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="1" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="2" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="3" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="4" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="5" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="6" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(0, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(0, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>08:00~10:00</td>
          <td><input type="checkbox" name="time_lim" value="7" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="8" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="9" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="10" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="11" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="12" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="13" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(1, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(1, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>10:00~12:00</td>
          <td><input type="checkbox" name="time_lim" value="14" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="15" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="16" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="17" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="18" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="19" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="20" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(2, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(2, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>12:00~14:00</td>
          <td><input type="checkbox" name="time_lim" value="21" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="22" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="23" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="24" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="25" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="26" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="27" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(3, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(3, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>14:00~16:00</td>
          <td><input type="checkbox" name="time_lim" value="28" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="29" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="30" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="31" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="32" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="33" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="34" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(4, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(4, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>16:00~18:00</td>
          <td><input type="checkbox" name="time_lim" value="35" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="36" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="37" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="38" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="39" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="40" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="41" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(5, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(5, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>18:00~20:00</td>
          <td><input type="checkbox" name="time_lim" value="42" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="43" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="44" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="45" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="46" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="47" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="48" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(6, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(6, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>20:00~22:00</td>
          <td><input type="checkbox" name="time_lim" value="49" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="50" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="51" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="52" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="53" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="54" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="55" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(7, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(7, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>22:00~00:00</td>
          <td><input type="checkbox" name="time_lim" value="56" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="57" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="58" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="59" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="60" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="61" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="62" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(8, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(8, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>00:00~02:00</td>
          <td><input type="checkbox" name="time_lim" value="63" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="64" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="65" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="66" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="67" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="68" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="69" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(9, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(9, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>02:00~04:00</td>
          <td><input type="checkbox" name="time_lim" value="70" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="71" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="72" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="73" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="74" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="75" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="76" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(10, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(10, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>04:00~06:00</td>
          <td><input type="checkbox" name="time_lim" value="77" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="78" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="79" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="80" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="81" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="82" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="83" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(11, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(11, 2)}>❎</button>
          </td>
        </tr><tr>
          <td>불침번 1</td>
          <td><input type="checkbox" name="time_lim" value="84" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="85" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="86" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="87" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="88" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="89" onchange="handleLimit();" /></td>
          <td><input type="checkbox" name="time_lim" value="90" onchange="handleLimit();" /></td>
          <td>
            <button type="button" onClick={() => checkButton(12, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(12, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>불침번 2</td>
          <td><input type="checkbox" name="time_lim" value="91" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="92" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="93" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="94" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="95" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="96" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="97" onChange={handleLimit}/></td>
          <td>
            <button type="button" onClick={() => checkButton(13, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(13, 2)}>❎</button>
          </td></tr>
        <tr>
          <td>불침번 3</td>
          <td><input type="checkbox" name="time_lim" value="98" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="99" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="100" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="101" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="102" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="103" onChange={handleLimit}/></td>
          <td><input type="checkbox" name="time_lim" value="104" onChange={handleLimit}/></td>
          <td>
            <button type="button" onClick={() => checkButton(14, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(14, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>불침번 4</td>
          <td><input type="checkbox" name="time_lim" value="105" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="106" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="107" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="108" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="109" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="110" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="111" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(15, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(15, 2)}>❎</button>
          </td>
        </tr>
        <tr>
          <td>불침번 5</td>
          <td><input type="checkbox" name="time_lim" value="112" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="113" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="114" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="115" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="116" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="117" onChange={handleLimit} /></td>
          <td><input type="checkbox" name="time_lim" value="118" onChange={handleLimit} /></td>
          <td>
            <button type="button" onClick={() => checkButton(16, 2)}>✅</button>
            <button type="button" onClick={() => resetButton(16, 2)}>❎</button>
          </td>
        </tr>

        <tr>
          <td>Day Check</td>
          <td>
            <button type="button" onClick={() => checkButton(0, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(0, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(1, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(1, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(2, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(2, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(3, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(3, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(4, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(4, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(5, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(5, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(6, 1)}>✅</button>
            <button type="button" onClick={() => resetButton(6, 1)}>❎</button>
          </td>
          <td>
            <button type="button" onClick={() => checkButton(0, 3)}>✅</button>
            <button type="button" onClick={() => resetButton(0, 3)}>❎</button>
          </td>
        </tr><tr>
          <td>야간 해제</td>
          <td>
            <button type="button" onClick={() => resetNightWorks(0)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(1)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(2)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(3)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(4)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(5)}>❌</button>
          </td>
          <td>
            <button type="button" onClick={() => resetNightWorks(6)}>❌</button>
          </td>
        </tr>

      </tbody>
    </InputTable>
    <InputList>
      {workers.map(worker => {
        return <NameTag name={worker.name} id={worker.id}></NameTag>
      } )}
    </InputList>
    </InputWrapper>
    <FixedInput>
      <h4>CCTV 고정 근무자 입력</h4>
      <FixedCCTV>
      <select id="fixed_day">
        <option id="day13" value="0">목</option>
        <option id="day23" value="1">금</option>
        <option className="sat" id="day33" value="2">토</option>
        <option className="sun" id="day43" value="3">일</option>
        <option id="day53" value="4">월</option>
        <option id="day63" value="5">화</option>
        <option id="day73" value="6">수</option>
      </select>
      <select id="fixed_time">
        <option value="0">06:00~08:00</option>
        <option value="1">08:00~10:00</option>
        <option value="2">10:00~12:00</option>
        <option value="3">12:00~14:00</option>
        <option value="4">14:00~16:00</option>
        <option value="5">16:00~18:00</option>
        <option value="6">18:00~20:00</option>
        <option value="7">20:00~22:00</option>
        <option value="8">22:00~00:00</option>
        <option value="9">00:00~02:00</option>
        <option value="10">02:00~04:00</option>
        <option value="11">04:00~06:00</option>
      </select>
      <select id="work_type">
        <option value="0">탄약고/무기고</option>
        <option value="1">주둔지</option>
      </select>
      <input placeholder="이름을 입력해주세요" type="text" id="fixed_name" />
      <button value="입력하기" id="fixed_submit" onclick="fixed_submit_button();">입력하기</button>
  
    </FixedCCTV>
    <h4>불침번 고정 근무자 입력</h4>
    <FixedBool>
        <select id="fixed_day2">
          <option id="day14" value="0">목</option>
          <option id="day24" value="1">금</option>
          <option class="sat" id="day34" value="2">토</option>
          <option class="sun" id="day44" value="3">일</option>
          <option id="day54" value="4">월</option>
          <option id="day64" value="5">화</option>
          <option id="day74" value="6">수</option>
        </select>
        <select id="bool_type">
          <option value="0">불침번1</option>
          <option value="1">불침번2</option>
          <option value="2">불침번3</option>
          <option value="3">불침번4</option>
          <option value="4">불침번5</option>
        </select>
        <input placeholder="이름을 입력해주세요" type="text" id="fixed_name2" />
        <button value="입력하기" id="fixed_submit2" onclick="fixed_submit_button2();">입력하기</button>
      
    </FixedBool>
    </FixedInput>
    <button className="make" value="경작서 만들어보기" id="run" onClick={start_program}>경작서 만들어보기</button>
    
    <ResultTable className="result_table">
      <caption>경작서</caption>
      <tbody><tr>
        <th></th>
        <th colspan="2"><p id="day12">목</p></th>
        <th colspan="2"><p id="day22">금</p></th>
        <th class="sat" colspan="2"><p id="day32">토</p></th>
        <th class="sun" colspan="2"><p id="day42">일</p></th>
        <th colspan="2"><p id="day52">월</p></th>
        <th colspan="2"><p id="day62">화</p></th>
        <th colspan="2"><p id="day72">수</p></th>
      </tr>
        <tr>
          <td>cctv 구분</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
          <td>탄약고/무기고</td>
          <td>주둔지</td>
        </tr>
        <tr>
          <td>06:00~08:00</td>
          <td><p id="data0"></p></td>
          <td><p id="data1"></p></td>
          <td><p id="data1000"></p></td>
          <td><p id="data1001"></p></td>
          <td><p id="data2000"></p></td>
          <td><p id="data2001"></p></td>
          <td><p id="data3000"></p></td>
          <td><p id="data3001"></p></td>
          <td><p id="data4000"></p></td>
          <td><p id="data4001"></p></td>
          <td><p id="data5000"></p></td>
          <td><p id="data5001"></p></td>
          <td><p id="data6000"></p></td>
          <td><p id="data6001"></p></td>
        </tr><tr>
          <td>08:00~10:00</td>
          <td><p id="data10"></p></td>
          <td><p id="data11"></p></td>
          <td><p id="data1010"></p></td>
          <td><p id="data1011"></p></td>
          <td><p id="data2010"></p></td>
          <td><p id="data2011"></p></td>
          <td><p id="data3010"></p></td>
          <td><p id="data3011"></p></td>
          <td><p id="data4010"></p></td>
          <td><p id="data4011"></p></td>
          <td><p id="data5010"></p></td>
          <td><p id="data5011"></p></td>
          <td><p id="data6010"></p></td>
          <td><p id="data6011"></p></td>
        </tr>
        <tr>
          <td>10:00~12:00</td>
          <td><p id="data20"></p></td>
          <td><p id="data21"></p></td>
          <td><p id="data1020"></p></td>
          <td><p id="data1021"></p></td>
          <td><p id="data2020"></p></td>
          <td><p id="data2021"></p></td>
          <td><p id="data3020"></p></td>
          <td><p id="data3021"></p></td>
          <td><p id="data4020"></p></td>
          <td><p id="data4021"></p></td>
          <td><p id="data5020"></p></td>
          <td><p id="data5021"></p></td>
          <td><p id="data6020"></p></td>
          <td><p id="data6021"></p></td>
        </tr>
        <tr>
          <td>12:00~14:00</td>
          <td><p id="data30"></p></td>
          <td><p id="data31"></p></td>
          <td><p id="data1030"></p></td>
          <td><p id="data1031"></p></td>
          <td><p id="data2030"></p></td>
          <td><p id="data2031"></p></td>
          <td><p id="data3030"></p></td>
          <td><p id="data3031"></p></td>
          <td><p id="data4030"></p></td>
          <td><p id="data4031"></p></td>
          <td><p id="data5030"></p></td>
          <td><p id="data5031"></p></td>
          <td><p id="data6030"></p></td>
          <td><p id="data6031"></p></td>
        </tr>
        <tr>
          <td>14:00~16:00</td>
          <td><p id="data40"></p></td>
          <td><p id="data41"></p></td>
          <td><p id="data1040"></p></td>
          <td><p id="data1041"></p></td>
          <td><p id="data2040"></p></td>
          <td><p id="data2041"></p></td>
          <td><p id="data3040"></p></td>
          <td><p id="data3041"></p></td>
          <td><p id="data4040"></p></td>
          <td><p id="data4041"></p></td>
          <td><p id="data5040"></p></td>
          <td><p id="data5041"></p></td>
          <td><p id="data6040"></p></td>
          <td><p id="data6041"></p></td>
        </tr>
        <tr>
          <td>16:00~18:00</td>
          <td><p id="data50"></p></td>
          <td><p id="data51"></p></td>
          <td><p id="data1050"></p></td>
          <td><p id="data1051"></p></td>
          <td><p id="data2050"></p></td>
          <td><p id="data2051"></p></td>
          <td><p id="data3050"></p></td>
          <td><p id="data3051"></p></td>
          <td><p id="data4050"></p></td>
          <td><p id="data4051"></p></td>
          <td><p id="data5050"></p></td>
          <td><p id="data5051"></p></td>
          <td><p id="data6050"></p></td>
          <td><p id="data6051"></p></td>
        </tr>
        <tr>
          <td>18:00~20:00</td>
          <td><p id="data60"></p></td>
          <td><p id="data61"></p></td>
          <td><p id="data1060"></p></td>
          <td><p id="data1061"></p></td>
          <td><p id="data2060"></p></td>
          <td><p id="data2061"></p></td>
          <td><p id="data3060"></p></td>
          <td><p id="data3061"></p></td>
          <td><p id="data4060"></p></td>
          <td><p id="data4061"></p></td>
          <td><p id="data5060"></p></td>
          <td><p id="data5061"></p></td>
          <td><p id="data6060"></p></td>
          <td><p id="data6061"></p></td>
        </tr>
        <tr>
          <td>20:00~22:00</td>
          <td><p id="data70"></p></td>
          <td><p id="data71"></p></td>
          <td><p id="data1070"></p></td>
          <td><p id="data1071"></p></td>
          <td><p id="data2070"></p></td>
          <td><p id="data2071"></p></td>
          <td><p id="data3070"></p></td>
          <td><p id="data3071"></p></td>
          <td><p id="data4070"></p></td>
          <td><p id="data4071"></p></td>
          <td><p id="data5070"></p></td>
          <td><p id="data5071"></p></td>
          <td><p id="data6070"></p></td>
          <td><p id="data6071"></p></td>
        </tr>
        <tr>
          <td>22:00~00:00</td>
          <td><p id="data80"></p></td>
          <td><p id="data81"></p></td>
          <td><p id="data1080"></p></td>
          <td><p id="data1081"></p></td>
          <td><p id="data2080"></p></td>
          <td><p id="data2081"></p></td>
          <td><p id="data3080"></p></td>
          <td><p id="data3081"></p></td>
          <td><p id="data4080"></p></td>
          <td><p id="data4081"></p></td>
          <td><p id="data5080"></p></td>
          <td><p id="data5081"></p></td>
          <td><p id="data6080"></p></td>
          <td><p id="data6081"></p></td>
        </tr>
        <tr>
          <td>00:00~02:00</td>
          <td><p id="data90"></p></td>
          <td><p id="data91"></p></td>
          <td><p id="data1090"></p></td>
          <td><p id="data1091"></p></td>
          <td><p id="data2090"></p></td>
          <td><p id="data2091"></p></td>
          <td><p id="data3090"></p></td>
          <td><p id="data3091"></p></td>
          <td><p id="data4090"></p></td>
          <td><p id="data4091"></p></td>
          <td><p id="data5090"></p></td>
          <td><p id="data5091"></p></td>
          <td><p id="data6090"></p></td>
          <td><p id="data6091"></p></td>
        </tr>
        <tr>
          <td>02:00~04:00</td>
          <td><p id="data100"></p></td>
          <td><p id="data101"></p></td>
          <td><p id="data1100"></p></td>
          <td><p id="data1101"></p></td>
          <td><p id="data2100"></p></td>
          <td><p id="data2101"></p></td>
          <td><p id="data3100"></p></td>
          <td><p id="data3101"></p></td>
          <td><p id="data4100"></p></td>
          <td><p id="data4101"></p></td>
          <td><p id="data5100"></p></td>
          <td><p id="data5101"></p></td>
          <td><p id="data6100"></p></td>
          <td><p id="data6101"></p></td>
        </tr>
        <tr>
          <td>04:00~06:00</td>
          <td><p id="data110"></p></td>
          <td><p id="data111"></p></td>
          <td><p id="data1110"></p></td>
          <td><p id="data1111"></p></td>
          <td><p id="data2110"></p></td>
          <td><p id="data2111"></p></td>
          <td><p id="data3110"></p></td>
          <td><p id="data3111"></p></td>
          <td><p id="data4110"></p></td>
          <td><p id="data4111"></p></td>
          <td><p id="data5110"></p></td>
          <td><p id="data5111"></p></td>
          <td><p id="data6110"></p></td>
          <td><p id="data6111"></p></td>
        </tr>
        <tr>
          <td>불침번1</td>
          <td><p id="data130"></p></td>
          <td></td>
          <td><p id="data1130"></p></td>
          <td></td>
          <td><p id="data2130"></p></td>
          <td></td>
          <td><p id="data3130"></p></td>
          <td></td>
          <td><p id="data4130"></p></td>
          <td></td>
          <td><p id="data5130"></p></td>
          <td></td>
          <td><p id="data6130"></p></td>
          <td></td>
        </tr>
        <tr>
          <td>불침번2</td>
          <td><p id="data131"></p></td>
          <td></td>
          <td><p id="data1131"></p></td>
          <td></td>
          <td><p id="data2131"></p></td>
          <td></td>
          <td><p id="data3131"></p></td>
          <td></td>
          <td><p id="data4131"></p></td>
          <td></td>
          <td><p id="data5131"></p></td>
          <td></td>
          <td><p id="data6131"></p></td>
          <td></td>
        </tr>
        <tr>
          <td>불침번3</td>
          <td><p id="data132"></p></td>
          <td></td>
          <td><p id="data1132"></p></td>
          <td></td>
          <td><p id="data2132"></p></td>
          <td></td>
          <td><p id="data3132"></p></td>
          <td></td>
          <td><p id="data4132"></p></td>
          <td></td>
          <td><p id="data5132"></p></td>
          <td></td>
          <td><p id="data6132"></p></td>
          <td></td>
        </tr>
        <tr>
          <td>불침번4</td>
          <td><p id="data133"></p></td>
          <td></td>
          <td><p id="data1133"></p></td>
          <td></td>
          <td><p id="data2133"></p></td>
          <td></td>
          <td><p id="data3133"></p></td>
          <td></td>
          <td><p id="data4133"></p></td>
          <td></td>
          <td><p id="data5133"></p></td>
          <td></td>
          <td><p id="data6133"></p></td>
          <td></td>
        </tr>
        <tr>
          <td>불침번5</td>
          <td><p id="data134"></p></td>
          <td></td>
          <td><p id="data1134"></p></td>
          <td></td>
          <td><p id="data2134"></p></td>
          <td></td>
          <td><p id="data3134"></p></td>
          <td></td>
          <td><p id="data4134"></p></td>
          <td></td>
          <td><p id="data5134"></p></td>
          <td></td>
          <td><p id="data6134"></p></td>
          <td></td>
        </tr>

      </tbody>
    </ResultTable>

  
  <SaveResult>
      <SaveBtn>

      </SaveBtn>

  </SaveResult>

  </Wrapper>

};

function SaveBtn () {
    
  const onSave = async() => {
    console.log(yagan);
    let date = document.getElementById("today").value;
    if (date.length === 0) {
      alert("날짜를 입력 후 버튼을 눌러주세요")
      return;
    }
    console.log(date);
    let year = date[0] + date[1] + date[2] + date[3];
    let month = date[5] + date[6];
    let day = date[8] + date[9];
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    let days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dateArr = [];
    // 윤년 check
    if (((year % 100 != 0) && (year % 4 == 0)) || year % 400 == 0) days[2]++;
    for (let i = 0; i < 7; i++) {
      // update
      let current_day = day + i;
      let current_month = month;
      let current_year = year;
      if (current_day > days[current_month]) {
        current_day -= days[current_month];
        current_month++;
        if (current_month == 13) {
          current_month = 1;
          current_year++;
        }
      }
      let current_date;
      current_date = `${String(current_year).padStart(4, "0")}-${String(current_month).padStart(2, "0")}-${String(current_day).padStart(2, "0")}`;
      console.log(current_date);
      let workData = [];
      for(let j = 0 ; j <= 11; j ++){
        workData.push(yagan[i][j][0]);
        workData.push(yagan[i][j][1]);
      }
      for(let j =0; j < 5; j++){
        workData.push(yagan[i][13][j]);
      }
      console.log(workData);
      await setDoc(doc(db, "works", current_date), {
        name: workData
      });

    }
  }
  

  return <div>
    <button onClick={onSave}>
      저장하기
    </button>
  </div>
}