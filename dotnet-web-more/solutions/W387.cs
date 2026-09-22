// W387: HMAC webhook signatures / HMAC-SHA256 hex verify for foxtrot-key
namespace DotnetWeb;
public static class W387{

public static IResult Verify(string payload,string signatureHex,string secret){
if(string.IsNullOrEmpty(signatureHex)||signatureHex.Length%2!=0)return Results.StatusCode(400);byte[] expected=HMACSHA256.HashData(Encoding.UTF8.GetBytes(secret),Encoding.UTF8.GetBytes(payload));byte[] provided;try{provided=Convert.FromHexString(signatureHex);}catch(FormatException){return Results.StatusCode(400);}bool ok=provided.Length==expected.Length&&CryptographicOperations.FixedTimeEquals(provided,expected);return ok?Results.Ok(new {verified=true}):Results.StatusCode(401);
}
}
