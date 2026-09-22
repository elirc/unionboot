// W447: Captured ILogger assertions / Structured Warning event 106
namespace DotnetWeb;
public static class W447{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Warning,new EventId(106,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
