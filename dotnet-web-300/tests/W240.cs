using static DotnetWeb.W240;
namespace DotnetWeb;
public static class TestsW240 { public static async Task Run() {
 await Task.CompletedTask;
{
  var u=Check.User(true,"customer_id","u7");((ClaimsIdentity)u.Identity!).AddClaim(new Claim("secret","hidden"));var c=await Check.Execute(Handle(u));Check.Equal("{\"id\":\"u7\"}",Check.Body(c));Check.Status(401,Handle(Check.User(false,"customer_id","u7")));Check.Status(403,Handle(Check.User(true,"other","x")));var duplicate=Check.User(true,"customer_id","u7");((ClaimsIdentity)duplicate.Identity!).AddClaim(new Claim("customer_id","u7"));Check.Status(403,Handle(duplicate));Check.Status(403,Handle(Check.User(true,"customer_id"," ")));
 }
} }
