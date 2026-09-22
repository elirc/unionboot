// W518: Form-file size gates / Batch upload each 32 bytes count 2
namespace DotnetWeb;
public static class W518{

public static IResult Gate(IFormFileCollection files){
if(files.Count==0)return Results.BadRequest();if(files.Count>2||files.Any(f=>f.Length>32))return Results.StatusCode(413);return Results.Ok(new {count=files.Count,total=files.Sum(f=>f.Length)});
}
}
