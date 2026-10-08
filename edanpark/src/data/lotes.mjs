// Mapa de lotes (aba Início). Contornos e rotas traçados sobre as duas imagens do empreendimento:
//   plan = planta vista de cima (public/media/lotes/lotes-plan.webp, 1100x750)
//   (lqip = miniatura borrada embutida, aparece enquanto a imagem não chega)
//   3d   = render em perspectiva (public/media/lotes/lotes-3d.webp, 1140x670)
// Coordenadas em pixels da própria imagem (mesmo sistema do viewBox). Para ajustar um lote, edite os pontos "plan"/"p3d".
// cp / c3 = onde fica a etiqueta (ponto mais "dentro" do lote).
// A numeração dos lotes e das quadras segue a imagem do site atual (inclusive o "Lote 14" e os saltos).
// area: preencha com os m² reais de cada lote (hoje fica "sob consulta"); rel = tamanho relativo medido na planta.
export const lotMap = {
  views: {
    plan: { src: "/media/lotes/lotes-plan.webp", w: 1100, h: 750, lqip: "UklGRrwAAABXRUJQVlA4ILAAAACQBQCdASocABMAPwFsrE6rJiQiMAgBYCAJaAC2yBuo+gsvoo98iZ5rg1qsOurqC8h1X5y5AADNX/Ze40D+D6vW0F0OXaaxW2dbqGX0y3lOtLWFgt8kUF3KSL3IWBI5BoxQirWU5IHyjxwgJSphTNZ/qxbSYEe2du6vp6NoR4Rmds+0t2+5mFyi53Nb/j7DGejqfzLz08wTvWn0LZRn0nM0ApTV+SsdTFeGDlOHR56gAA==", alt: "Planta do Edan Park vista de cima, com os 13 lotes distribuídos em três quadras" },
    "3d": { src: "/media/lotes/lotes-3d.webp", w: 1140, h: 670, lqip: "UklGRtQAAABXRUJQVlA4IMgAAAAQBQCdASocABMAPwFosFGrJSSisBgIAWAgCWoAnTMbOgAL4cMpuSHjUNXbRQDCM9VwANpQ61JmuO9T5xvgDzBmXDgPTS/aTlNSsC/nyMFxLCZX+60jBI+8CspU8NpZb6r+/FpDG7tErFjcf1jOsjhWe8955IxvDzptyxrDhTMCNoHhe2RY8CJjDpAWT4x7oYXnyxI4o0sBWN5zuECYdyrau/bQ7oac/82eI/R2KpTtSTTyS4KbkweZLQIfjsnGU/N5GLiFInLAAA==", alt: "Vista aérea em perspectiva do Edan Park, com os 13 lotes distribuídos em três quadras" },
  },
  quadras: { A: "Quadra A", B: "Quadra B", C: "Quadra C" },
  lotes: [
    { id: "A01", q: "A", n: "01", area: null, rel: 0.66, cp: [440,545], c3: [167,241],
      plan: "449,487 460,487 461,493 485,491 490,598 488,624 472,622 458,610 444,605 435,595 414,590 407,577 389,573 387,565 380,564 380,560 372,555 372,536 377,507 447,496",
      p3d: "103,223 145,191 269,209 156,318" },
    { id: "A02", q: "A", n: "02", area: null, rel: 1.0, cp: [541,610], c3: [228,389],
      plan: "549,478 568,478 570,489 576,490 578,513 574,517 580,518 581,535 577,536 577,541 594,652 589,687 575,688 556,676 495,636 492,536 489,535 492,488",
      p3d: "162,367 295,227 384,248 272,440 215,465 182,448 170,440" },
    { id: "A03", q: "A", n: "03", area: null, rel: 0.71, cp: [624,492], c3: [345,453],
      plan: "630,462 646,462 650,473 671,676 671,688 633,697 624,697 623,686 617,685 617,674 621,673 620,656 596,488 596,476 601,475 602,466",
      p3d: "420,257 497,271 367,501 271,489" },
    { id: "A08", q: "A", n: "08", area: null, rel: 0.35, cp: [753,640], c3: [510,555],
      plan: "730,472 744,474 753,550 770,643 769,660 744,663 739,655 728,573 720,569 720,557 724,557 726,551 719,512 713,511 713,499 717,498 715,476",
      p3d: "570,361 612,366 525,592 466,585" },
    { id: "A07", q: "A", n: "07", area: null, rel: 0.37, cp: [801,626], c3: [593,577],
      plan: "777,472 793,472 821,632 821,642 804,649 787,651 784,639 763,491 763,477",
      p3d: "635,389 682,395 615,615 545,610" },
    { id: "B01", q: "B", n: "01", area: null, rel: 0.38, cp: [417,389], c3: [289,114],
      plan: "422,289 432,289 435,294 442,383 446,384 446,394 443,395 443,406 435,408 437,434 412,438 387,438 391,406 389,381 393,381 395,375 402,304",
      p3d: "205,129 362,52 302,139" },
    { id: "B02", q: "B", n: "02", area: null, rel: 0.51, cp: [491,389], c3: [372,147],
      plan: "494,265 505,265 506,270 523,419 479,424 466,424 464,415 460,333 453,308 453,296 457,293 451,292 451,280",
      p3d: "320,162 405,55 462,65 385,185" },
    { id: "B03", q: "B", n: "03", area: null, rel: 0.46, cp: [556,298], c3: [464,179],
      plan: "528,260 572,264 584,269 581,282 587,338 591,369 597,370 597,382 593,383 595,405 591,411 546,409 528,292",
      p3d: "412,197 495,77 542,105 477,222" },
    { id: "B04", q: "B", n: "04", area: null, rel: 0.72, cp: [658,360], c3: [583,210],
      plan: "604,284 614,284 623,287 624,292 632,292 645,307 715,349 729,362 735,362 735,367 758,396 763,420 763,443 748,443 744,441 744,434 743,431 704,431 700,418 678,403 617,394 621,376 618,357 613,356 616,341 610,340 609,335 608,316 612,312 610,306 605,306",
      p3d: "572,136 630,193 686,262 688,324 665,328 605,298 582,265 521,222" },
    { id: "C14", q: "C", n: "14", area: null, rel: 0.47, cp: [822,265], c3: [828,255],
      plan: "800,221 820,222 821,228 870,238 880,253 908,272 920,274 927,286 927,299 909,298 907,302 893,305 887,305 882,296 871,295 845,296 825,302 801,301 779,289 776,272 784,261 789,243 798,235",
      p3d: "762,243 832,215 915,278 972,328 980,350 937,352 905,345 898,325 770,265" },
    { id: "C05", q: "C", n: "05", area: null, rel: 0.46, cp: [846,355], c3: [810,380],
      plan: "844,325 871,325 873,328 890,443 877,449 834,453 830,423 823,422 823,412 827,412 828,407 825,390 818,389 818,379 822,375 815,363 815,355 809,354 807,344 798,339 798,328",
      p3d: "755,268 877,315 855,446 742,441 765,320" },
    { id: "C06", q: "C", n: "06", area: null, rel: 0.28, cp: [869,500], c3: [784,510],
      plan: "875,454 895,456 897,517 888,537 876,539 868,545 867,553 859,555 849,555 847,550 837,462",
      p3d: "745,462 852,465 850,500 820,540 805,560 720,568 735,510" },
    { id: "C01", q: "C", n: "01", area: null, rel: 0.61, cp: [970,391], c3: [988,473],
      plan: "936,309 947,309 957,321 967,323 973,339 978,340 987,354 1003,366 1011,380 1012,398 1007,422 980,463 968,471 943,475 933,416 926,413 926,402 931,399 920,346 921,311",
      p3d: "940,355 982,357 1030,405 1060,460 1067,495 1050,532 950,551 908,540 923,420" },
  ],
  // Caminho do percurso, seguindo as vias internas: do portão da Edan até a última quadra.
  route: {
    plan: "275,482 320,487 420,467 528,437 595,429 662,429 687,442 699,483 701,583 707,650 720,683 753,683 837,617 903,577 916,500 912,425 895,317",
    p3d: "160,178 220,189 300,206 380,235 470,257 540,278 562,312 555,350 535,395 515,435 485,480 460,520 435,565 410,605 440,625 510,642 580,655 660,652 740,633 795,615 845,572 872,535 882,490 898,440 912,398 920,355",
  },
};
