class authUtils{

    public isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    public isValidPassword(password: string): boolean {
        const minLength = 8; 
    
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); 
    
        const isLengthValid = password.length >= minLength;
        const isComplexEnough = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    
        return isLengthValid && isComplexEnough;
    } 
    public isValidUsername(username: string): boolean {
        if( username === "" || username.length <3){
            return false
        }
        else{
            return true
        }
    }
    public isValueThere(value:string):boolean{
        if (value=""){
            return false
        }else{
            return true
        }
    }
}