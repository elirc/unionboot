// W346: IFormFile in-memory binding / UTF8 upload cap 7 bytes
namespace DotnetWeb;
public static class W346{

public static async Task<IResult> Handle(IFormFile? file){
if(file is null||file.Length==0)return Results.BadRequest();using var buffer=new MemoryStream();await file.CopyToAsync(buffer);if(buffer.Length>7)return Results.StatusCode(413);return Results.Ok(new {size=buffer.Length,text=Encoding.UTF8.GetString(buffer.ToArray())});
}
}
