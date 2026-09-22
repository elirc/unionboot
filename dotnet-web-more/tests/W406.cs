using static DotnetWeb.W406;
namespace DotnetWeb;
public static class TestsW406{public static async Task Run(){await Task.CompletedTask;
{
var store=new Store{Revision=8,Value="old"};var c=Check.Context();c.Request.Headers["If-Match"]="\"8\"";Check.Status(204,Update(c,store,"new"));Check.Equal(9,store.Revision);Check.Equal("new",store.Value);Check.Equal("\"9\"",c.Response.Headers["ETag"].ToString());Check.Status(412,Update(c,store,"again"));Check.Equal("new",store.Value);
}
{
var store=new Store{Revision=8,Value="old"};var c=Check.Context();Check.Status(428,Update(c,store,"new"));c.Request.Headers["If-Match"]="W/\"8\"";Check.Status(412,Update(c,store,"new"));Check.Equal(8,store.Revision);c.Request.Headers["If-Match"]="*";Check.Status(204,Update(c,store,"new"));
}
}}
