//#########################################################################################
plugins["PrintButton"] = {
    "isDefault": true,
    "viewer": {
        "renderLight": async function (blockId, saveData) {
            const element = document.createElement('button');
            element.innerText = '印刷する';
            element.classList.add("buttonFlat");
            element.classList.add("print_button");
            element.addEventListener("click", () => {
                window.print();
            });
            return element;
        },
    },
    "toolbox": {
        "render": async function (saveData) {
            const element = document.createElement('button');
            element.innerText = '印刷する';
            element.classList.add("buttonFlat");
            element.classList.add("print_button");
            element.addEventListener("click", () => {
                window.print();
            });
            return element;
        },
    },
    "css": async () => `
        @media print {
            .print_button {
                display: none;
            }
        }
    `,
}
