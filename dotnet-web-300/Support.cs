global using System;
global using System.IO;
global using System.Linq;
global using System.Text;
global using System.Text.Json;
global using System.Globalization;
global using System.Collections.Generic;
global using System.Threading;
global using System.Threading.Tasks;
global using System.Security.Claims;
global using System.Runtime.CompilerServices;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Http.Features;
global using Microsoft.AspNetCore.Routing;
global using Microsoft.AspNetCore.Routing.Patterns;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Options;
global using Microsoft.Extensions.Primitives;

namespace DotnetWeb;
public static class Check {
 public static int Assertions;
 public static void True(bool value){Assertions++;if(!value)throw new Exception("Expected true");}
 public static void Equal<T>(T expected,T actual){Assertions++;if(expected is CancellationToken left&&actual is CancellationToken right){if(!left.Equals(right))throw new Exception("Expected identical CancellationToken");return;}var a=JsonSerializer.Serialize(expected);var b=JsonSerializer.Serialize(actual);if(a!=b)throw new Exception($"Expected {a}, got {b}");}
 public static void Status(int expected,IResult result){Assertions++;int? declared=(result as IStatusCodeHttpResult)?.StatusCode;int effective=declared??200;if(effective!=expected)throw new Exception($"Expected HTTP {expected}, got {(declared.HasValue?declared.Value.ToString():"execution default")} for "+result.GetType().Name);}
 public static void Throws<T>(Action action) where T:Exception {Assertions++;try{action();}catch(T){return;}throw new Exception("Expected "+typeof(T).Name);}
 public static async Task ThrowsAsync<T>(Func<Task> action) where T:Exception {Assertions++;try{await action();}catch(T){return;}throw new Exception("Expected "+typeof(T).Name);}
 private static readonly ServiceProvider Services=new ServiceCollection().AddLogging().AddOptions().BuildServiceProvider();
 public static DefaultHttpContext Context(string query=""){var c=new DefaultHttpContext();c.RequestServices=Services;c.Response.Body=new MemoryStream();c.Request.QueryString=new QueryString(query);return c;}
 public static DefaultHttpContext JsonRequest(string body){var c=Context();c.Request.ContentType="application/json";c.Request.Body=new MemoryStream(Encoding.UTF8.GetBytes(body));return c;}
 public static DefaultHttpContext FormRequest(string body){var c=Context();c.Request.ContentType="application/x-www-form-urlencoded";c.Request.Body=new MemoryStream(Encoding.UTF8.GetBytes(body));c.Request.ContentLength=c.Request.Body.Length;return c;}
 public static async Task<DefaultHttpContext> Execute(IResult result){var c=Context();await result.ExecuteAsync(c);return c;}
 public static string Body(HttpContext c)=>Encoding.UTF8.GetString(((MemoryStream)c.Response.Body).ToArray());
 public static void Json<T>(HttpContext c,string property,T expected){using var doc=JsonDocument.Parse(Body(c));Equal(JsonSerializer.Serialize(expected),doc.RootElement.GetProperty(property).GetRawText());}
 public static ClaimsPrincipal User(bool authenticated,string type,string value)=>new(new ClaimsIdentity(new[]{new Claim(type,value)},authenticated?"test":null));
 public static async IAsyncEnumerable<int> Sequence(params int[] values){foreach(var value in values){yield return value;await Task.Yield();}}
 public static DefaultHttpContext StartedContext(){var features=new FeatureCollection();features.Set<IHttpResponseFeature>(new StartedResponse());var c=new DefaultHttpContext(features);return c;}
 private sealed class StartedResponse:IHttpResponseFeature {
  public int StatusCode {get;set;}=200;public string? ReasonPhrase{get;set;}public IHeaderDictionary Headers{get;set;}=new HeaderDictionary();public Stream Body{get;set;}=new MemoryStream();public bool HasStarted=>true;
  public void OnStarting(Func<object,Task> callback,object state){}public void OnCompleted(Func<object,Task> callback,object state){}
 }
}
public sealed class ManualClock:TimeProvider {private DateTimeOffset now=new(2024,1,1,0,0,0,TimeSpan.Zero);public override DateTimeOffset GetUtcNow()=>now;public void Advance(TimeSpan delta)=>now+=delta;}
public static class JsonExtensions {public static bool TryGetInt32Safe(this JsonElement value,out int n){n=0;return value.ValueKind==JsonValueKind.Number&&value.TryGetInt32(out n);}}
