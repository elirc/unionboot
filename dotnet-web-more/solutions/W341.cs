// W341: IFormFile in-memory binding / UTF8 upload cap 2 bytes
namespace DotnetWeb;
public static class W341{

public static async Task<IResult> Handle(IFormFile? file){
if(file is null||file.Length==0)return Results.BadRequest();using var buffer=new MemoryStream();await file.CopyToAsync(buffer);if(buffer.Length>2)return Results.StatusCode(413);return Results.Ok(new {size=buffer.Length,text=Encoding.UTF8.GetString(buffer.ToArray())});
}
}
