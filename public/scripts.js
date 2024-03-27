const menuIcon = document.getElementById("menuIcon");
const closeSpans = document.querySelectorAll(".close");
// const modals = document.getElementsByClassName("modal");
const modals = document.querySelectorAll(".modal");

const adminSignUpNavBtn = document.getElementById("admin-signup-btn");
const adminSignUpFormDiv = document.getElementById("admin-signup-form-div");
const adminFirstName = document.getElementById("admiin-firstName");
const adminLastName = document.getElementById("admin-lastName");
const adminEmail = document.getElementById("admin-email");
const adminNewPassword = document.getElementById("admin-newPassword");
const adminConfirmPassword = document.getElementById("admin-confirmPassword");
const adminSignupSubmitBtn = document.getElementById("admin-signUp-Submit-Btn");
const adminSignupForm = document.getElementById("admin-signup-form");

const adminLoginNavBtn = document.getElementById("admin-login-btn");
const adminLoginDiv = document.getElementById("admin-login-form-div");
const adminLoginEmail = document.getElementById("admin-login-email");
const adminLoginPassword = document.getElementById("admin-login-password");
const adminLoginForm = document.getElementById("admin-login-form");

const distSignUpNavBtn = document.getElementById("dist-signup-btn");
const distSignUpFormDiv = document.getElementById("dist-signup-form-div");
const distFirstName = document.getElementById("dist-firstName");
const distLastName = document.getElementById("dist-lastName");
const distEmail = document.getElementById("dist-email");
const distLocation = document.getElementById("dist-location");
const distNewPassword = document.getElementById("dist-newPassword");
const distConfirmPassword = document.getElementById("dist-confirmPassword");
const distSignupSubmitBtn = document.getElementById("dist-signUp-Submit-Btn");
const distSignupForm = document.getElementById("dist-signup-form");

const distLoginNavBtn = document.getElementById("dist-login-btn");
const distLoginDiv = document.getElementById("dist-login-form-div");
const distLoginEmail = document.getElementById("dist-login-email");
const distLoginPassword = document.getElementById("dist-login-password");
const distLoginForm = document.getElementById("dist-login-form");

menuIcon.addEventListener("click", menuFunction);
function menuFunction() {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
}};

window.onclick = function(event) {
    // for (let i = 0; i < modals.length; i++) {
    //     if (event.target === modals[i]) {
    //         adminSignUpFormDiv.style.display = "none";
    //     }
    // }

    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

closeSpans.forEach(closeSpan => {
    closeSpan.addEventListener("click", () => {
        closeParentModal(closeSpan);
    });
});

function closeParentModal(element) {
    const modal = element.closest(".modal");
    if (modal) {
        modal.style.display = "none";
    }
}

adminSignUpNavBtn.addEventListener("click", ()=> {
    adminSignUpFormDiv.style.display = "block";
});

distSignUpNavBtn.addEventListener( "click", ()=>{
    distSignUpFormDiv.style.display = "block";
});

function adminSignUpFormValidation() {
    if (  adminNewPassword.value.trim() != '' && adminConfirmPassword.value.trim() != '' && adminNewPassword.value === adminConfirmPassword.value ) {
        adminSignupSubmitBtn.disabled = false;
    } else {
        adminSignupSubmitBtn.disabled = true;
    }
}

function distSignUpFormValidation() {
    if(distNewPassword.value.trim() != '' && distConfirmPassword.value.trim() != '' &&   distNewPassword.value == distConfirmPassword.value ) {
        distSignupSubmitBtn.disabled = false;
    } else {
        distSignupSubmitBtn.disabled = true;
    }
}
adminNewPassword.addEventListener("input", adminSignUpFormValidation);
adminConfirmPassword.addEventListener("input", adminSignUpFormValidation);

distNewPassword.addEventListener("input", distSignUpFormValidation);
distConfirmPassword.addEventListener("input", distSignUpFormValidation);

adminSignupForm.addEventListener("submit", (e)=> {
    adminSignUpFormDiv.style.display = "none";
    e.preventDefault();
    const adminDetails = {
        adminFirstName: adminFirstName.value,
        adminLastName: adminLastName.value,
        adminEmail: adminEmail.value,
        adminPassword: adminConfirmPassword.value
    }
    console.log(adminDetails);
    registerAdmin(adminDetails);
});

async function registerAdmin(adminDetails) {
    try {
        const response = await fetch(`/admin/admin-register`, {
            method:"POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify ({
                adminFirstName: adminDetails.adminFirstName,
                adminLastName: adminDetails.adminLastName,
                adminEmail: adminDetails.adminEmail,
                adminPassword: adminDetails.adminPassword
            }),
        });

        if(response.status == 201) {
            console.log("New Admin Added");
            adminSignUpFormDiv.style.display = "none";
            // loginDiv.style.display = "block";
        } else if (response.status == 200){
            console.log("Admin Already exits");
            alert("Admin with same email id already Exits !!!");
        }
    } catch (error) {
        console.log(error);
    }
}

adminLoginNavBtn.addEventListener("click", ()=> {
    adminLoginDiv.style.display= "block";
})

adminLoginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    const adminLoginDetails = {
        adminLoginEmail: adminLoginEmail.value,
        adminLoginPassword: adminLoginPassword.value
    }
    console.log(adminLoginDetails);
    loginAdmin(adminLoginDetails);
});

async function loginAdmin(adminLoginDetails) {
    try {
        const response = await fetch(`/admin/admin-login`, {
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                adminLoginEmail: adminLoginDetails.adminLoginEmail,
                adminLoginPassword: adminLoginDetails.adminLoginPassword
            } )
        });

        if(response.status === 200) {
            adminLoginDiv.style.display = "none";
            const data = await response.json();
            localStorage.setItem('token', data.adminToken);
            localStorage.setItem('isAdminLoggedIn', true);
            console.log(data);
            window.location.href="/adminPanel"
        }
    } catch (error) {
        console.log(error);
    }
}

distSignupForm.addEventListener("submit", (e)=> {
    distSignUpFormDiv.style.display = "none";
    e.preventDefault();
    const distDetails = {
        distFirstName: distFirstName.value,
        distLastName: distLastName.value,
        distEmail: distEmail.value,
        distLocation: distLocation.value,
        distPassword: distConfirmPassword.value
    }
    console.log(distDetails);
    registerDistributor(distDetails);
});

async function registerDistributor(distDetails) {
    try {
        const response = await fetch( `/dist/dist-register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                distFirstName: distDetails.distFirstName,
                distLastName: distDetails.distLastName,
                distLocation: distDetails.distLocation,
                distEmail: distDetails.distEmail,
                distPassword: distDetails.distPassword
            } )
        } );

        if(response.status === 201) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.log(error)
    }
}

distLoginNavBtn.addEventListener("click" , ()=> {
    distLoginDiv.style.display = "block";
});

distLoginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    const distLoginDetails = {
        distEmailLogin : distLoginEmail.value,
        distLoginPassword: distLoginPassword.value
    }
    loginDist(distLoginDetails)
});

async function loginDist(distLoginDetails) {
    try {
        const response = await fetch(`/dist/dist-login`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify ( {
                distEmailLogin : distLoginDetails.distEmailLogin,
                distLoginPassword: distLoginDetails.distLoginPassword
            } )
        });

        if(response.status === 200 ) {
            const currentDistributor = await response.json();
            localStorage.setItem('token', currentDistributor.token);
            localStorage.setItem('isDistLoggedIn', true);
            window.location.href="/distPanel"
            console.log("Current Distributor",currentDistributor);
        }
    } catch (error) {
        console.log(error);
    }
}