using static DotnetWeb.W375;
namespace DotnetWeb;
public static class TestsW375{public static async Task Run(){await Task.CompletedTask;
{
var c=Check.Context();c.Request.Method="OPTIONS";c.Request.Headers["Origin"]="https://app5.example";c.Request.Headers["Access-Control-Request-Method"]="DELETE";c.Request.Headers["Access-Control-Request-Headers"]="X-App";var r=Evaluate(c);Check.True(r.IsOriginAllowed);Check.True(r.IsPreflightRequest);Check.Equal("https://app5.example",c.Response.Headers["Access-Control-Allow-Origin"].ToString());Check.Equal("true",c.Response.Headers["Access-Control-Allow-Credentials"].ToString());Check.True(c.Response.Headers["Access-Control-Allow-Methods"].ToString().Contains("DELETE"));
}
{
var c=Check.Context();c.Request.Headers["Origin"]="https://unlisted.example";var r=Evaluate(c);Check.True(!r.IsOriginAllowed);Check.True(!c.Response.Headers.ContainsKey("Access-Control-Allow-Origin"));
}
}}
