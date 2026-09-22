// W589: Multipart section counting through ReadFormAsync / Multipart 9 distinct fields with repeated values
namespace DotnetWeb;
public static class W589{

public static async Task<IResult> Count(HttpContext context){
var form=await context.Request.ReadFormAsync(context.RequestAborted);return Results.Ok(new {keys=form.Count,values=form.Sum(x=>x.Value.Count),files=form.Files.Count,bytes=form.Files.Sum(f=>f.Length)});
}
}
