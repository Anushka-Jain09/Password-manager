function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}
function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}
const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    let arrUpdated = arr.filter((e) => e.website !== website);
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert(`Successfully deleted ${website}'s password.`);
    showPasswords();
};
const showPasswords = () => {
    let tb = document.querySelector("table tbody");
    let data = localStorage.getItem("passwords");

   if (data == null || JSON.parse(data).length === 0) {
        tb.innerHTML = "<tr><td colspan='4'>No Data To Show</td></tr>";
    } else {
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            str += `<tr>
                <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" height="10"></td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
            </tr>`;
        }
        tb.innerHTML = str;
    }
};
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();

  const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

   if (website && username && password) {
        let passwords = localStorage.getItem("passwords");
        let json = passwords ? JSON.parse(passwords) : [];
        json.push({ website, username, password });
        localStorage.setItem("passwords", JSON.stringify(json));
        
        alert("Password Saved");
        showPasswords(); 
        document.getElementById("passwordForm").reset(); 
    } else {
        alert("Please fill out all fields.");
    }
});
document.getElementById("exportBtn").addEventListener("click", function() {
    let passwords = localStorage.getItem("passwords");
    if (!passwords) {
        alert("No passwords to export.");
        return;
    }
    
    let json = JSON.parse(passwords);
    const ws = XLSX.utils.json_to_sheet(json);

 try {
        const existingWorkbook = XLSX.readFile("Passwords.xlsx"); 
        const existingSheet = existingWorkbook.Sheets[existingWorkbook.SheetNames[0]];
        const existingData = XLSX.utils.sheet_to_json(existingSheet);
        const combinedData = existingData.concat(json);
        const newWs = XLSX.utils.json_to_sheet(combinedData);
        const newWb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWb, newWs, "Passwords");
        XLSX.writeFile(newWb, "Passwords.xlsx");
    } catch (error) {
        const newWb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWb, ws, "Passwords");
        XLSX.writeFile(newWb, "Passwords.xlsx");
    }

  alert("Passwords exported successfully!");
});
showPasswords();