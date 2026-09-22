// W347: IFormFile in-memory binding / UTF8 upload cap 8 bytes
namespace DotnetWeb;
public static class W347{

public static async Task<IResult> Handle(IFormFile? file){
if(file is null||file.Length==0)return Results.BadRequest();using var buffer=new MemoryStream();await file.CopyToAsync(buffer);if(buffer.Length>8)return Results.StatusCode(413);return Results.Ok(new {size=buffer.Length,text=Encoding.UTF8.GetString(buffer.ToArray())});
}
}
