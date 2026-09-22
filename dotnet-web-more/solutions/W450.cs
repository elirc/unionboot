// W450: Captured ILogger assertions / Structured Debug event 109
namespace DotnetWeb;
public static class W450{

public static void Record(ILogger logger,string job,int count,Exception? error){
logger.Log(LogLevel.Debug,new EventId(109,"job"),error,"Job {Job} processed {Count}",job,count);
}
}
