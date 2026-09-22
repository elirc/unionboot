using static DotnetWeb.W405;
namespace DotnetWeb;
public static class TestsW405{public static async Task Run(){await Task.CompletedTask;
{
var store=new Store{Revision=7,Value="old"};var c=Check.Context();c.Request.Headers["If-Match"]="\"7\"";Check.Status(204,Update(c,store,"new"));Check.Equal(8,store.Revision);Check.Equal("new",store.Value);Check.Equal("\"8\"",c.Response.Headers["ETag"].ToString());Check.Status(412,Update(c,store,"again"));Check.Equal("new",store.Value);
}
{
var store=new Store{Revision=7,Value="old"};var c=Check.Context();Check.Status(428,Update(c,store,"new"));c.Request.Headers["If-Match"]="W/\"7\"";Check.Status(412,Update(c,store,"new"));Check.Equal(7,store.Revision);c.Request.Headers["If-Match"]="*";Check.Status(204,Update(c,store,"new"));
}
}}
