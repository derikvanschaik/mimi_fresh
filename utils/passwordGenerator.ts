export default async function generatePassword(length: number): Promise<string> {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    let password = "";
    for (let i = 0; i < randomValues.length; i++) {
      const randomIndex = randomValues[i] % charset.length;
      password += charset.charAt(randomIndex);
    }
    
    return password;
}
  