// import './style.css'
import Three from "./utils/test2"

new Three({
    dom: document.querySelector(".canvas"),
});

// alert("ok")



// document.addEventListener('DOMContentLoaded', () => {
//     let totalBlocks = 15

//     let projectLine = document.querySelector(".projects_lines");
//     let projectLineWidth = projectLine.offsetWidth;
//     let oneBlockWidth = projectLineWidth / totalBlocks;

//     let projectLines = document.querySelectorAll(".projects_lines");
//     projectLines.forEach(proLine => {
//         proLine.style.gap = (oneBlockWidth * 2) + "px";
//     });


//     const projectContainers = document.querySelectorAll('.project_container');
//     projectContainers.forEach((element, index) => {
//         if ((index + 1) % 2 === 1) { 
//             element.style.marginTop = (oneBlockWidth * 2 - 8) + "px";
//         }
//     });

//     let listImgConts = document.querySelectorAll(".list_img_cont");
//     listImgConts.forEach(imgCont => {
//         imgCont.style.width = (oneBlockWidth * 6.5) + "px";
//         imgCont.style.height = (oneBlockWidth * 3.75) + "px";
//     })
// });
    
// console.log(oneBlockWidth, oneBlockHeight)