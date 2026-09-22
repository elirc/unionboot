global using System;
global using System.IO;
global using System.Linq;
global using System.Text;
global using System.Text.Json;
global using System.Globalization;
global using System.Collections.Generic;
global using System.Threading;
global using System.Threading.Tasks;
global using System.Threading.Channels;
global using System.Threading.RateLimiting;
global using System.Security.Cryptography;
global using System.Net.WebSockets;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Http.Features;
global using Microsoft.AspNetCore.Builder;
global using Microsoft.AspNetCore.Routing;
global using Microsoft.AspNetCore.Routing.Patterns;
global using Microsoft.AspNetCore.RateLimiting;
global using Microsoft.AspNetCore.Cors.Infrastructure;
global using Microsoft.AspNetCore.OutputCaching;
global using Microsoft.AspNetCore.Diagnostics;
global using Microsoft.AspNetCore.Localization;
global using Microsoft.AspNetCore.StaticFiles;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Options;
global using Microsoft.Extensions.Primitives;
global using Microsoft.Extensions.Hosting;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Diagnostics.HealthChecks;
namespace DotnetWeb;
public static class Check {
 public static int Assertions;
 public static void True(bool value){Assertions++;if(!value)throw new Exception("Expected true");}
 public static void Equal<T>(T expected,T actual){Assertions++;if(expected is CancellationToken left&&actual is CancellationToken right){if(!left.Equals(right))throw new Exception("Expected identical CancellationToken");return;}var a=JsonSerializer.Serialize(expected);var b=JsonSerializer.Serialize(actual);if(a!=b)throw new Exception($"Expected {a}, got {b}");}
 public static void Status(int expected,IResult result){Assertions++;int? declared=(result as IStatusCodeHttpResult)?.StatusCode;int effective=declared??200;if(effective!=expected)throw new Exception($"Expected HTTP {expected}, got {effective}");}
 public static void Throws<T>(Action action) where T:Exception{Assertions++;try{action();}catch(T){return;}throw new Exception("Expected "+typeof(T).Name);}
 public static async Task ThrowsAsync<T>(Func<Task> action) where T:Exception{Assertions++;try{await action();}catch(T){return;}throw new Exception("Expected "+typeof(T).Name);}
 private static readonly ServiceProvider Services=new ServiceCollection().AddLogging().AddOptions().BuildServiceProvider();
 public static DefaultHttpContext Context(string query=""){var c=new DefaultHttpContext();c.RequestServices=Services;c.Response.Body=new MemoryStream();c.Request.QueryString=new QueryString(query);return c;}
 public static async Task<DefaultHttpContext> Execute(IResult result){var c=Context();await result.ExecuteAsync(c);return c;}
 public static string Body(HttpContext c)=>Encoding.UTF8.GetString(((MemoryStream)c.Response.Body).ToArray());
 public static void Json<T>(HttpContext c,string property,T expected){using var doc=JsonDocument.Parse(Body(c));var wanted=JsonSerializer.SerializeToElement(expected);True(JsonElement.DeepEquals(wanted,doc.RootElement.GetProperty(property)));}
 public static IFormFile File(string text){var bytes=Encoding.UTF8.GetBytes(text);return new FormFile(new MemoryStream(bytes),0,bytes.Length,"file","note.txt");}
 public static ServiceProvider LinkServices(string name,string pattern){var b=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse(pattern),0);b.Metadata.Add(new EndpointNameMetadata(name));return new ServiceCollection().AddLogging().AddRouting().AddSingleton<EndpointDataSource>(new DefaultEndpointDataSource(b.Build())).BuildServiceProvider();}
 public static DefaultHttpContext MultipartRequest((string Name,string Value)[] fields,(string Name,string Filename,string Text)[] files){const string boundary="offline_boundary";var b=new StringBuilder();foreach(var f in fields)b.Append($"--{boundary}\r\nContent-Disposition: form-data; name=\"{f.Name}\"\r\n\r\n{f.Value}\r\n");foreach(var f in files)b.Append($"--{boundary}\r\nContent-Disposition: form-data; name=\"{f.Name}\"; filename=\"{f.Filename}\"\r\nContent-Type: text/plain\r\n\r\n{f.Text}\r\n");b.Append($"--{boundary}--\r\n");var c=Context();var bytes=Encoding.UTF8.GetBytes(b.ToString());c.Request.Method="POST";c.Request.ContentType="multipart/form-data; boundary="+boundary;c.Request.Body=new MemoryStream(bytes);c.Request.ContentLength=bytes.Length;return c;}
}
public sealed class FilterContext(HttpContext http,params object?[] arguments):EndpointFilterInvocationContext{public override HttpContext HttpContext=>http;public override IList<object?> Arguments=>arguments;public override T GetArgument<T>(int index)=>(T)arguments[index]!;}
public sealed class PredicateConstraint(Func<string,RouteValueDictionary,bool> predicate):IRouteConstraint{public bool Match(HttpContext? http,IRouter? route,string routeKey,RouteValueDictionary values,RouteDirection direction)=>predicate(routeKey,values);}
public sealed class DelegateCachePolicy(Action<OutputCacheContext> request):IOutputCachePolicy{public ValueTask CacheRequestAsync(OutputCacheContext c,CancellationToken t){request(c);return ValueTask.CompletedTask;}public ValueTask ServeFromCacheAsync(OutputCacheContext c,CancellationToken t)=>ValueTask.CompletedTask;public ValueTask ServeResponseAsync(OutputCacheContext c,CancellationToken t)=>ValueTask.CompletedTask;}
public sealed class ManualClock:TimeProvider{private DateTimeOffset now=new(2024,1,1,0,0,0,TimeSpan.Zero);public override DateTimeOffset GetUtcNow()=>now;public void Advance(TimeSpan delta)=>now+=delta;}
public sealed class DelegateHost(Func<CancellationToken,Task> start,Func<CancellationToken,Task> stop):IHostedService{public Task StartAsync(CancellationToken t)=>start(t);public Task StopAsync(CancellationToken t)=>stop(t);}
public sealed record LogEntry(LogLevel Level,EventId EventId,string Message,Exception? Error,Dictionary<string,object?> Values);
public sealed class CaptureProvider:ILoggerProvider{public List<LogEntry> Entries{get;}=new();public ILogger CreateLogger(string name)=>new Captured(Entries);public void Dispose(){}private sealed class Captured(List<LogEntry> entries):ILogger{public IDisposable? BeginScope<TState>(TState state) where TState:notnull=>null;public bool IsEnabled(LogLevel level)=>true;public void Log<TState>(LogLevel level,EventId id,TState state,Exception? error,Func<TState,Exception?,string> formatter){var values=(state as IEnumerable<KeyValuePair<string,object?>>)?.ToDictionary(x=>x.Key,x=>x.Value)??new();entries.Add(new LogEntry(level,id,formatter(state,error),error,values));}}}
public sealed class SocketFeature(bool enabled):IHttpWebSocketFeature{public bool IsWebSocketRequest=>enabled;public int Calls{get;private set;}public string? Protocol{get;private set;}public Task<WebSocket> AcceptAsync(WebSocketAcceptContext context){Calls++;Protocol=context.SubProtocol;return Task.FromResult(WebSocket.CreateFromStream(new MemoryStream(),true,context.SubProtocol,Timeout.InfiniteTimeSpan));}}
public sealed class RouteHost(IServiceProvider services):IEndpointRouteBuilder{public IServiceProvider ServiceProvider=>services;public ICollection<EndpointDataSource> DataSources{get;}=new List<EndpointDataSource>();public IApplicationBuilder CreateApplicationBuilder()=>new ApplicationBuilder(services);}
