// import './style.css'
import Three from "./utils/three"
// import Three from "./utils/ok.js"
import gsap from "gsap";

new Three({
    dom: document.querySelector(".canvas"),
});

// function breakTheTextGsap(domElem) {
//     let domElemVar = domElem.textContent;
//     let domElemHeight = domElem.offsetHeight;
//     // alert(domElemHeight)
//     let splittedText = domElemVar.split("");
//     let clutter = "";  
//     splittedText.forEach(function(element, index) {
//         clutter += `<span class="element">${element}</span>`;
//     });
//     h1.innerHTML = clutter

//     gsap.from(".element", {
//         y: domElemHeight,
//         duration:0.8,
//         stagger:0.02,
//         ease: "expoScale(0.5,7,none)", 
//     })
// }

// let h1 = document.querySelector(".info h1");
// breakTheTextGsap(h1)

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