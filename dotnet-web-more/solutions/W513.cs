// W513: Form-file size gates / Batch upload each 12 bytes count 3
namespace DotnetWeb;
public static class W513{

public static IResult Gate(IFormFileCollection files){
if(files.Count==0)return Results.BadRequest();if(files.Count>3||files.Any(f=>f.Length>12))return Results.StatusCode(413);return Results.Ok(new {count=files.Count,total=files.Sum(f=>f.Length)});
}
}
