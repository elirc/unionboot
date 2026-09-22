// W343: IFormFile in-memory binding / UTF8 upload cap 4 bytes
namespace DotnetWeb;
public static class W343{

public static async Task<IResult> Handle(IFormFile? file){
if(file is null||file.Length==0)return Results.BadRequest();using var buffer=new MemoryStream();await file.CopyToAsync(buffer);if(buffer.Length>4)return Results.StatusCode(413);return Results.Ok(new {size=buffer.Length,text=Encoding.UTF8.GetString(buffer.ToArray())});
}
}
