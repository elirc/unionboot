// W520: Form-file size gates / Batch upload each 40 bytes count 1
namespace DotnetWeb;
public static class W520{

public static IResult Gate(IFormFileCollection files){
if(files.Count==0)return Results.BadRequest();if(files.Count>1||files.Any(f=>f.Length>40))return Results.StatusCode(413);return Results.Ok(new {count=files.Count,total=files.Sum(f=>f.Length)});
}
}
